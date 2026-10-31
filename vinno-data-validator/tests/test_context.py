import json
from pathlib import Path

import yaml

from vuls_validator.validator import assess_path

ROOT = Path(__file__).resolve().parents[1]
STANDARD = ROOT.parent / "vinno-universal-data-standard"
SCHEMA = STANDARD / "schemas" / "0.2" / "observation-record.schema.json"
SCHEMA_01 = STANDARD / "schemas" / "observation-record.schema.json"
DICTIONARIES = STANDARD / "dictionaries"
CONTEXT = STANDARD / "examples" / "0.2" / "context"
WEIGHT_01 = STANDARD / "examples" / "valid" / "canine-body-weight.json"


def assess(name, schema=SCHEMA):
    return assess_path(CONTEXT / name, schema, DICTIONARIES)


def test_backfill_is_valid_without_review():
    result = assess("weight-backfill.json")
    assert result.errors == []
    assert result.review_required == []
    record = json.loads((CONTEXT / "weight-backfill.json").read_text(encoding="utf-8"))
    assert record["observation"]["observed_at"] != record["observation"]["entered_at"]


def test_measurement_after_entry_is_review_not_error():
    result = assess("weight-measured-after-entry.json")
    assert result.errors == []
    assert any("after entry time" in item for item in result.review_required)


def test_missing_observed_at_is_error():
    result = assess("weight-missing-time.json")
    assert any("observed_at" in item for item in result.errors)


def test_body_condition_without_system_needs_review():
    result = assess("bcs-without-system.json")
    assert result.errors == []
    assert any("scoring_system" in item for item in result.review_required)


def test_body_condition_with_system_has_no_review():
    result = assess("bcs-with-system.json")
    assert result.errors == []
    assert result.review_required == []


def test_food_intake_without_basis_needs_review():
    result = assess("food-without-basis.json")
    assert result.errors == []
    assert any("offered or consumed" in item for item in result.review_required)


def test_activity_without_period_is_warning():
    result = assess("activity-without-period.json")
    assert result.errors == []
    assert any("observation_period" in item for item in result.warnings)


def test_stool_category_is_marked_provisional():
    concepts = yaml.safe_load((DICTIONARIES / "concepts.yaml").read_text(encoding="utf-8"))
    stool = concepts["concepts"]["stool_consistency"]
    assert stool["system"] == "VINNO_STOOL_CATEGORY_0.1"
    assert stool["clinical_validation"] is False
    result = assess("stool-provisional.json")
    assert result.errors == []
    assert result.warnings == []
    assert any("not a validated clinical score" in item for item in result.review_required)


def test_missing_instrument_on_weight_is_warning_for_old_record():
    result = assess_path(WEIGHT_01, SCHEMA_01, DICTIONARIES)
    assert result.errors == []
    assert any("instrument" in item for item in result.warnings)


def test_missing_instrument_on_stool_is_not_warned():
    result = assess("stool-provisional.json")
    assert not any("instrument" in item for item in result.warnings)


def test_unnamed_source_needs_review():
    result = assess("weight-unnamed-source.json")
    assert result.errors == []
    assert any("do not treat the value as verified" in item for item in result.review_required)


def test_bad_observer_id_is_error():
    result = assess("weight-bad-observer.json")
    assert any("observer_id" in item for item in result.errors)


def test_instrument_detail_satisfies_weight_without_a_name_string():
    record_path = CONTEXT / "weight-backfill.json"
    record = json.loads(record_path.read_text(encoding="utf-8"))
    record["method"].pop("instrument", None)
    record["method"]["instrument_detail"] = {
        "instrument_id": "scale-a",
        "instrument_type": "electronic_scale",
        "model": "Example",
        "calibration_status": "not_applicable",
    }
    from vuls_validator.dictionaries import load_dictionaries
    from vuls_validator.validator import assess_record

    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    result = assess_record(record, schema, load_dictionaries(DICTIONARIES))
    assert result.errors == []
    assert not any("instrument" in item for item in result.warnings)


def test_calibrated_instrument_without_date_needs_review():
    record = json.loads((CONTEXT / "weight-backfill.json").read_text(encoding="utf-8"))
    record["method"]["instrument_detail"] = {
        "instrument_id": "scale-a",
        "calibration_status": "calibrated",
    }
    from vuls_validator.dictionaries import load_dictionaries
    from vuls_validator.validator import assess_record

    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    result = assess_record(record, schema, load_dictionaries(DICTIONARIES))
    assert result.errors == []
    assert any("calibration_date" in item for item in result.review_required)


def test_unknown_quality_status_is_error():
    result = assess("weight-bad-quality.json")
    assert result.errors
    assert any("approved" in item or "status" in item for item in result.errors)
