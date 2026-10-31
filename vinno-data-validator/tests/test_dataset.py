import json
import shutil
from pathlib import Path

import pytest
from typer.testing import CliRunner

from vuls_validator.cli import app
from vuls_validator.dataset import validate_dataset
from vuls_validator.validator import validate_path

ROOT = Path(__file__).resolve().parents[1]
STANDARD = ROOT.parent / "vinno-universal-data-standard"
SCHEMAS = STANDARD / "schemas" / "0.2"
DICTIONARIES = STANDARD / "dictionaries"
DATASET = STANDARD / "examples" / "datasets" / "synthetic-weight-follow-up"
AGE_EXAMPLES = STANDARD / "examples" / "0.2"
SUBJECT_SCHEMA = SCHEMAS / "subject.schema.json"


def test_longitudinal_dataset_links_one_dog_across_time():
    results = validate_dataset(DATASET, SCHEMAS, DICTIONARIES)
    failures = {path.name: issues for path, issues in results.items() if issues}
    assert failures == {}
    observations = list((DATASET / "observations").glob("*.json"))
    assert len(observations) == 4
    subject_ids = set()
    for path in observations:
        record = json.loads(path.read_text(encoding="utf-8"))
        subject_ids.add(record["subject_id"])
        assert record["study_id"] == "dog-aging-001"
        assert "subject" not in record
    assert subject_ids == {"synthetic-dog-001"}


@pytest.mark.parametrize("name", ["subject-estimated.json", "subject-unknown.json"])
def test_age_modes_that_do_not_invent_a_birthday(name):
    issues = validate_path(AGE_EXAMPLES / name, SUBJECT_SCHEMA, DICTIONARIES)
    assert issues == []


def test_estimated_age_cannot_also_carry_a_birth_date():
    record = json.loads((AGE_EXAMPLES / "subject-estimated.json").read_text(encoding="utf-8"))
    record["age_information"]["birth_date"] = "2018-04-12"
    schema = json.loads(SUBJECT_SCHEMA.read_text(encoding="utf-8"))
    from vuls_validator.dictionaries import load_dictionaries
    from vuls_validator.validator import validate_record

    issues = validate_record(record, schema, load_dictionaries(DICTIONARIES))
    assert any("not converted into a birth date" in issue or "birth_date" in issue for issue in issues)


def test_unknown_subject_reference_fails(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(DATASET, copy)
    path = copy / "observations" / "weight-2026-01-01.json"
    record = json.loads(path.read_text(encoding="utf-8"))
    record["subject_id"] = "synthetic-dog-404"
    path.write_text(json.dumps(record), encoding="utf-8")
    results = validate_dataset(copy, SCHEMAS, DICTIONARIES)
    issues = results[path]
    assert any("does not match a subject" in issue for issue in issues)


def test_birth_date_after_observation_fails(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(DATASET, copy)
    path = copy / "subjects" / "synthetic-dog-001.json"
    record = json.loads(path.read_text(encoding="utf-8"))
    record["age_information"]["birth_date"] = "2027-01-01"
    path.write_text(json.dumps(record), encoding="utf-8")
    results = validate_dataset(copy, SCHEMAS, DICTIONARIES)
    observation_issues = [
        issue
        for file_path, issues in results.items()
        if file_path.parent.name == "observations"
        for issue in issues
    ]
    assert any("after observed_at" in issue for issue in observation_issues)


def test_observation_without_enrollment_fails(tmp_path):
    copy = tmp_path / "dataset"
    shutil.copytree(DATASET, copy)
    for path in (copy / "enrollments").glob("*.json"):
        path.unlink()
    results = validate_dataset(copy, SCHEMAS, DICTIONARIES)
    assert any("no enrollment" in issue for issues in results.values() for issue in issues)


def test_cli_validate_dataset():
    runner = CliRunner()
    result = runner.invoke(
        app,
        [
            "validate-dataset",
            str(DATASET),
            "--schemas",
            str(SCHEMAS),
            "--dictionaries",
            str(DICTIONARIES),
        ],
    )
    assert result.exit_code == 0, result.stdout
    assert "INVALID" not in result.stdout
