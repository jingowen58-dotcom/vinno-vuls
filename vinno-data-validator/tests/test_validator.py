import json
from pathlib import Path

import pytest
import yaml
from typer.testing import CliRunner

from vuls_validator.cli import app
from vuls_validator.dictionaries import load_dictionaries
from vuls_validator.validator import validate_directory, validate_path, validate_record

ROOT = Path(__file__).resolve().parents[1]
STANDARD = ROOT.parent / "vinno-universal-data-standard"
SCHEMA_PATH = STANDARD / "schemas" / "observation-record.schema.json"
DICTIONARIES = STANDARD / "dictionaries"
VALID = STANDARD / "examples" / "valid"
INVALID = STANDARD / "examples" / "invalid"

EXPECTED_INVALID = {
    "weight-missing-unit.json": "$.observation.unit",
    "weight-unit-lb.json": "lb",
    "unknown-concept.json": "biological_age",
    "species-cat.json": "Felis catus",
    "open-without-licence.json": "licence",
}


@pytest.fixture(scope="module")
def schema():
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def dictionaries():
    return load_dictionaries(DICTIONARIES)


def test_dictionary_matches_schema(schema):
    concept_enum = schema["$defs"]["observation"]["properties"]["concept"]["enum"]
    species_enum = schema["$defs"]["subject"]["properties"]["species"]["enum"]
    concepts = yaml.safe_load((DICTIONARIES / "concepts.yaml").read_text(encoding="utf-8"))
    species = yaml.safe_load((DICTIONARIES / "species.yaml").read_text(encoding="utf-8"))
    assert concept_enum == sorted(concepts["concepts"])
    initial = [
        row["scientific_name"]
        for row in species["species"]
        if row["profile_status"] == "initial"
    ]
    assert species_enum == initial


def test_valid_examples_pass():
    results = validate_directory(VALID, SCHEMA_PATH, DICTIONARIES)
    assert results, "expected synthetic valid examples"
    failures = {path.name: issues for path, issues in results.items() if issues}
    assert failures == {}


@pytest.mark.parametrize("name,fragment", EXPECTED_INVALID.items())
def test_invalid_examples_fail(name, fragment):
    issues = validate_path(INVALID / name, SCHEMA_PATH, DICTIONARIES)
    assert issues
    assert any(fragment in issue for issue in issues)


def test_private_record_cannot_allow_redistribution(schema, dictionaries):
    record = json.loads((VALID / "canine-body-weight.json").read_text(encoding="utf-8"))
    record["permission"] = {
        "publication_status": "private",
        "permitted_uses": ["public_redistribution"],
    }
    issues = validate_record(record, schema, dictionaries)
    assert any("private record" in issue for issue in issues)


def test_body_condition_rejects_fraction(schema, dictionaries):
    record = json.loads((VALID / "canine-body-condition.json").read_text(encoding="utf-8"))
    record["observation"]["value"] = 5.5
    issues = validate_record(record, schema, dictionaries)
    assert any("whole number" in issue for issue in issues)


def test_reference_range_requires_source(schema, dictionaries):
    record = json.loads((VALID / "canine-body-weight.json").read_text(encoding="utf-8"))
    record["observation"]["reference_range"] = {"low": 20, "high": 35, "unit": "kg"}
    issues = validate_record(record, schema, dictionaries)
    assert any("reference_range" in issue for issue in issues)


def test_cli_accepts_valid_example():
    runner = CliRunner()
    result = runner.invoke(
        app,
        [
            "validate",
            str(VALID / "canine-body-weight.json"),
            "--schema",
            str(SCHEMA_PATH),
            "--dictionaries",
            str(DICTIONARIES),
        ],
    )
    assert result.exit_code == 0
    assert "VALID" in result.stdout
