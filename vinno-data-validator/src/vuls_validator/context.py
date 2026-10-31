from __future__ import annotations

from datetime import datetime


def context_findings(record: dict) -> tuple[list[str], list[str]]:
    """Return warnings and review items. These do not make a record invalid."""
    warnings: list[str] = []
    review: list[str] = []
    observation = record.get("observation")
    if not isinstance(observation, dict):
        return warnings, review

    concept = observation.get("concept")
    method = record.get("method") if isinstance(record.get("method"), dict) else {}
    provenance = record.get("provenance") if isinstance(record.get("provenance"), dict) else {}
    _check_time_order(observation, review)
    _check_source(provenance, review)
    if method.get("method_type") == "unknown":
        review.append(
            "$.method.method_type: unknown method; do not treat this measurement as comparable to a named method"
        )

    if concept == "body_weight" and not _has_instrument(method):
        warnings.append(
            "$.method.instrument: body weight does not name an instrument; "
            "records from different scales may not share the same precision"
        )
    detail = method.get("instrument_detail")
    if isinstance(detail, dict) and detail.get("calibration_status") == "calibrated" and not detail.get("calibration_date"):
        review.append(
            "$.method.instrument_detail.calibration_date: status is calibrated but no calibration date is recorded"
        )
    if concept == "body_condition_score" and not observation.get("scoring_system"):
        review.append(
            "$.observation.scoring_system: body condition score has no scoring system; "
            "different 1-9 systems are not interchangeable"
        )
    elif concept == "food_intake" and not observation.get("quantity_basis"):
        review.append(
            "$.observation.quantity_basis: food intake does not say whether the amount was offered or consumed"
        )
    elif concept == "activity_duration" and not observation.get("observation_period"):
        warnings.append(
            "$.observation.observation_period: not set; min/day and h/day already mean a rate over one day"
        )
    elif concept == "stool_consistency":
        review.append(
            "$.observation.concept: VINNO_STOOL_CATEGORY_0.1 is provisional and is not a validated clinical score"
        )
    return warnings, review


def _has_instrument(method: dict) -> bool:
    if method.get("instrument"):
        return True
    detail = method.get("instrument_detail")
    return isinstance(detail, dict) and bool(detail.get("instrument_id"))


def _check_time_order(observation: dict, review: list[str]) -> None:
    observed = _parse_datetime(observation.get("observed_at"))
    entered = _parse_datetime(observation.get("entered_at"))
    if observed is not None and entered is not None and observed > entered:
        review.append(
            "$.observation.observed_at: measurement time is after entry time; review the dates instead of rejecting the record"
        )


def _check_source(provenance: dict, review: list[str]) -> None:
    if not provenance.get("source_type"):
        review.append("$.provenance.source_type: missing source; do not treat the value as verified")
        return
    named = any(provenance.get(key) for key in ("source_name", "source_record_id", "source_uri"))
    if not named:
        review.append(
            "$.provenance: source type is set but no source name, record id, or URI; do not treat the value as verified"
        )


def _parse_datetime(value: object) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
