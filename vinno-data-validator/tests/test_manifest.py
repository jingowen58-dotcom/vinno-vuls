import json
import shutil
from pathlib import Path

from typer.testing import CliRunner

from vuls_validator.cli import app
from vuls_validator.dataset import validate_dataset
from vuls_validator.manifest import check_manifest

ROOT = Path(__file__).resolve().parents[1]
STANDARD = ROOT.parent / "vinno-universal-data-standard"
SCHEMA = STANDARD / "schemas" / "0.2" / "dataset-manifest.schema.json"
SCHEMAS = STANDARD / "schemas" / "0.2"
DICTIONARIES = STANDARD / "dictionaries"
FOLLOW_UP = STANDARD / "examples" / "datasets" / "synthetic-weight-follow-up"
REVISION = STANDARD / "examples" / "datasets" / "synthetic-weight-revision"


def test_follow_up_manifest_locks_four_current_observations():
    issues = check_manifest(FOLLOW_UP / "manifest.json", FOLLOW_UP, SCHEMA)
    assert issues == []
    manifest = json.loads((FOLLOW_UP / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["dataset_version"] == "1.0.0"
    assert manifest["vuls_version"] == "0.2.0"
    assert manifest["observation_count"] == 4
    assert all(lock["revision_id"] is None for lock in manifest["files"] if lock["record_id"])


def test_revision_manifest_locks_history_but_counts_one_current():
    issues = check_manifest(REVISION / "manifest.json", REVISION, SCHEMA)
    assert issues == []
    manifest = json.loads((REVISION / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["observation_count"] == 1
    locked = {lock["revision_id"] for lock in manifest["files"] if lock["revision_id"]}
    assert locked == {"rev-weight-1", "rev-weight-2", "rev-weight-3"}


def test_changed_bytes_fail_checksum(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(REVISION, copy)
    target = copy / "observations" / "weight-2026-02-01-r1.json"
    original = target.read_text(encoding="utf-8")
    target.write_text(original.replace("28.5", "28.6"), encoding="utf-8")
    issues = check_manifest(copy / "manifest.json", copy, SCHEMA)
    assert any("does not match the file bytes" in issue for issue in issues)
    assert "28.5" in (REVISION / "observations" / "weight-2026-02-01-r1.json").read_text(encoding="utf-8")


def test_manifest_cannot_grant_a_use_the_records_lack(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(REVISION, copy)
    manifest_path = copy / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["permitted_uses"] = ["research", "commercial_analysis"]
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    issues = check_manifest(manifest_path, copy, SCHEMA)
    assert any("commercial_analysis" in issue for issue in issues)


def test_wrong_observation_count_fails(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(FOLLOW_UP, copy)
    manifest_path = copy / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["observation_count"] = 99
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    issues = check_manifest(manifest_path, copy, SCHEMA)
    assert any("current observations" in issue for issue in issues)


def test_dataset_without_using_manifest_still_validates():
    bare = FOLLOW_UP
    results = validate_dataset(bare, SCHEMAS, DICTIONARIES)
    assert all(not issues for issues in results.values())


def test_check_manifest_command():
    runner = CliRunner()
    result = runner.invoke(
        app,
        [
            "check-manifest",
            str(REVISION / "manifest.json"),
            "--dataset",
            str(REVISION),
            "--schema",
            str(SCHEMA),
        ],
    )
    assert result.exit_code == 0, result.stdout
    assert "dataset_version 1.0.0" in result.stdout
    assert "vuls_version 0.2.0" in result.stdout
    assert "observation_count 1" in result.stdout
    assert "rev-weight-3" in result.stdout
