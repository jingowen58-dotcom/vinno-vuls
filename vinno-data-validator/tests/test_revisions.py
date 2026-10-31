import json
import shutil
from pathlib import Path

from typer.testing import CliRunner

from vuls_validator.cli import app
from vuls_validator.dataset import validate_dataset
from vuls_validator.revisions import current_observations, history_for, permission_reviews, read_observation_files

ROOT = Path(__file__).resolve().parents[1]
STANDARD = ROOT.parent / "vinno-universal-data-standard"
SCHEMAS = STANDARD / "schemas" / "0.2"
DICTIONARIES = STANDARD / "dictionaries"
CHAIN = STANDARD / "examples" / "datasets" / "synthetic-weight-revision"
FOLLOW_UP = STANDARD / "examples" / "datasets" / "synthetic-weight-follow-up"


def _failures(directory):
    results = validate_dataset(directory, SCHEMAS, DICTIONARIES)
    return {path.name: issues for path, issues in results.items() if issues}


def _rewrite(directory, name, mutate):
    path = directory / "observations" / name
    record = json.loads(path.read_text(encoding="utf-8"))
    mutate(record)
    path.write_text(json.dumps(record), encoding="utf-8")
    return path


def test_revision_chain_keeps_original_value():
    assert _failures(CHAIN) == {}
    original = json.loads((CHAIN / "observations" / "weight-2026-02-01-r1.json").read_text(encoding="utf-8"))
    assert original["observation"]["value"] == 28.5
    assert original["observation"]["observed_at"] == "2026-02-01T09:00:00Z"
    current = current_observations(read_observation_files(CHAIN))
    assert len(current) == 1
    assert current[0][1]["observation"]["value"] == 28.8
    assert current[0][1]["revision"]["revision_status"] == "current"


def test_history_is_ordered_and_original_follow_up_has_no_fake_revisions():
    history = history_for(read_observation_files(CHAIN), "weight-2026-02-01")
    assert [record["revision"]["revision_number"] for _path, record in history] == [1, 2, 3]
    follow_up = read_observation_files(FOLLOW_UP)
    assert len(follow_up) == 4
    assert all("revision" not in record for _path, record in follow_up)
    assert len(current_observations(follow_up)) == 4


def test_missing_previous_revision_is_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r2.json", lambda record: record["revision"].__setitem__("previous_revision_id", "rev-missing"))
    text = json.dumps(_failures(copy))
    assert "does not match a revision" in text


def test_duplicate_revision_id_is_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r3.json", lambda record: record["revision"].__setitem__("revision_id", "rev-weight-2"))
    assert "duplicated" in json.dumps(_failures(copy))


def test_cycle_is_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r1.json", lambda record: record["revision"].__setitem__("previous_revision_id", "rev-weight-3"))
    assert "cycle" in json.dumps(_failures(copy))


def test_two_current_versions_are_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r2.json", lambda record: record["revision"].__setitem__("revision_status", "current"))
    assert "expected superseded" in json.dumps(_failures(copy))


def test_missing_reason_is_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r2.json", lambda record: record["revision"].__setitem__("revision_reason", None))
    assert "revision_reason" in json.dumps(_failures(copy))


def test_skipped_revision_number_is_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r2.json", lambda record: record["revision"].__setitem__("revision_number", 4))
    assert "previous revision by one" in json.dumps(_failures(copy))


def test_branch_is_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    extra = copy / "observations" / "weight-2026-02-01-r2b.json"
    record = json.loads((copy / "observations" / "weight-2026-02-01-r2.json").read_text(encoding="utf-8"))
    record["revision"]["revision_id"] = "rev-weight-2b"
    record["revision"]["revision_status"] = "current"
    extra.write_text(json.dumps(record), encoding="utf-8")
    assert "more than one successor" in json.dumps(_failures(copy))


def test_withdrawal_keeps_history_out_of_current(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r3.json", lambda record: record["revision"].update({
        "revision_status": "superseded",
    }))
    withdrawal = json.loads((copy / "observations" / "weight-2026-02-01-r3.json").read_text(encoding="utf-8"))
    withdrawal["revision"] = {
        "revision_id": "rev-weight-4",
        "revision_number": 4,
        "revision_type": "withdrawal",
        "previous_revision_id": "rev-weight-3",
        "revision_reason": "The weighing could not be tied to a source note",
        "revision_status": "withdrawn",
        "created_at": "2026-02-04T12:00:00Z",
        "created_by": "editor-001",
    }
    (copy / "observations" / "weight-2026-02-01-r4.json").write_text(json.dumps(withdrawal), encoding="utf-8")
    assert _failures(copy) == {}
    rows = read_observation_files(copy)
    assert history_for(rows, "weight-2026-02-01")[-1][1]["revision"]["revision_type"] == "withdrawal"
    assert current_observations(rows) == []


def test_second_withdrawal_is_error(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(CHAIN, copy)
    _rewrite(copy, "weight-2026-02-01-r3.json", lambda record: record["revision"].update({
        "revision_type": "withdrawal",
        "revision_status": "withdrawn",
        "revision_reason": "Withdrawn once",
    }))
    again = json.loads((copy / "observations" / "weight-2026-02-01-r3.json").read_text(encoding="utf-8"))
    again["revision"] = {
        "revision_id": "rev-weight-4",
        "revision_number": 4,
        "revision_type": "withdrawal",
        "previous_revision_id": "rev-weight-3",
        "revision_reason": "Withdrawn again",
        "revision_status": "withdrawn",
        "created_at": "2026-02-04T12:00:00Z",
        "created_by": "editor-001",
    }
    (copy / "observations" / "weight-2026-02-01-r4.json").write_text(json.dumps(again), encoding="utf-8")
    assert "cannot be revised again" in json.dumps(_failures(copy))


def test_added_permission_is_review_not_error():
    rows = read_observation_files(CHAIN)
    _path, record = next(item for item in rows if item[1]["revision"]["revision_id"] == "rev-weight-3")
    record["permission"]["permitted_uses"] = ["research", "commercial_analysis"]
    reviews = permission_reviews(rows)
    assert any("commercial_analysis" in item for item in reviews[_path])


def test_show_history_command():
    runner = CliRunner()
    result = runner.invoke(app, ["show-history", "weight-2026-02-01", "--dataset", str(CHAIN)])
    assert result.exit_code == 0, result.stdout
    assert "28.5" in result.stdout
    assert "28.8" in result.stdout
    assert result.stdout.index("28.5") < result.stdout.index("28.8")
