from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path

from dataclasses import dataclass

from jsonschema import Draft202012Validator, FormatChecker

from .context import context_findings
from .dictionaries import load_dictionaries


@dataclass(frozen=True)
class Assessment:
    errors: list[str]
    warnings: list[str]
    review_required: list[str]


def validate_path(
    record_path: str | Path,
    schema_path: str | Path,
    dictionary_dir: str | Path,
) -> list[str]:
    return assess_path(record_path, schema_path, dictionary_dir).errors


def assess_path(
    record_path: str | Path,
    schema_path: str | Path,
    dictionary_dir: str | Path,
) -> Assessment:
    path = Path(record_path)
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return Assessment([f"$: invalid JSON ({exc.msg})"], [], [])
    schema = json.loads(Path(schema_path).read_text(encoding="utf-8"))
    dictionaries = load_dictionaries(dictionary_dir)
    return assess_record(record, schema, dictionaries)


def assess_record(record: object, schema: dict, dictionaries: dict) -> Assessment:
    errors = validate_record(record, schema, dictionaries)
    warnings: list[str] = []
    review: list[str] = []
    if isinstance(record, dict):
        warnings, review = context_findings(record)
    return Assessment(errors, warnings, review)


def validate_directory(
    directory: str | Path,
    schema_path: str | Path,
    dictionary_dir: str | Path,
) -> dict[Path, list[str]]:
    results: dict[Path, list[str]] = {}
    for path in sorted(Path(directory).glob("*.json")):
        results[path] = validate_path(path, schema_path, dictionary_dir)
    return results


def validate_record(record: object, schema: dict, dictionaries: dict) -> list[str]:
    issues = _schema_issues(record, schema)
    if isinstance(record, dict):
        issues.extend(_semantic_issues(record, dictionaries))
    return issues


def _schema_issues(record: object, schema: dict) -> list[str]:
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(record), key=lambda item: list(map(str, item.path)))
    issues = []
    for error in errors:
        location = "$." + ".".join(map(str, error.absolute_path)) if error.absolute_path else "$"
        issues.append(f"{location}: {error.message}")
    return issues


def _semantic_issues(record: dict, dictionaries: dict) -> list[str]:
    if record.get("vuls_version") == "0.2.0":
        return _semantic_02(record, dictionaries)
    issues: list[str] = []
    _check_species(record, dictionaries["species"], issues)
    _check_dates(record, issues)
    _check_observation(record, dictionaries["concepts"], dictionaries["units"], issues)
    _check_permission(record, issues)
    return issues


def _semantic_02(record: dict, dictionaries: dict) -> list[str]:
    issues: list[str] = []
    kind = record.get("record_type")
    if kind == "subject":
        _check_named_species(record.get("species"), dictionaries["species"], "$.species", issues)
        _check_age_information(record.get("age_information"), issues)
    elif kind == "study":
        _check_study_dates(record, issues)
        for index, name in enumerate(record.get("species") or []):
            _check_named_species(name, dictionaries["species"], f"$.species[{index}]", issues)
    elif kind == "observation":
        _check_dates(record, issues)
        _check_observation(record, dictionaries["concepts"], dictionaries["units"], issues)
        _check_permission(record, issues)
        _check_revision_fields(record, issues)
    return issues


def _check_named_species(name: object, species_rows: list[dict], path: str, issues: list[str]) -> None:
    known = {row["scientific_name"]: row for row in species_rows}
    if name not in known:
        issues.append(f"{path}: {name!r} is not in the species dictionary")
        return
    if known[name].get("profile_status") != "initial":
        issues.append(f"{path}: {name} is not accepted by this VULS draft")


def _check_age_information(age_information: object, issues: list[str]) -> None:
    if not isinstance(age_information, dict):
        return
    status = age_information.get("status")
    birth_date = age_information.get("birth_date")
    precision = age_information.get("birth_date_precision")
    estimate = age_information.get("age_estimate")
    prefix = "$.age_information"
    if status == "known_birth_date":
        if not isinstance(birth_date, str) or _parse_date(birth_date) is None:
            issues.append(f"{prefix}.birth_date: a known birth date must be YYYY-MM-DD")
        if precision not in {"exact", "year", "month"}:
            issues.append(f"{prefix}.birth_date_precision: a known birth date needs exact, year, or month")
        if estimate is not None:
            issues.append(f"{prefix}.age_estimate: must be null when a birth date is known")
    elif status == "estimated":
        if birth_date is not None:
            issues.append(
                f"{prefix}.birth_date: must be null for an estimated age; "
                "an estimate is not converted into a birth date"
            )
        if precision != "unknown":
            issues.append(f"{prefix}.birth_date_precision: an estimated age uses precision unknown")
        if not isinstance(estimate, dict):
            issues.append(f"{prefix}.age_estimate: an estimated age requires value, unit, estimated_at, and estimation_method")
        else:
            estimated_at = estimate.get("estimated_at")
            if not isinstance(estimated_at, str) or _parse_date(estimated_at) is None:
                issues.append(f"{prefix}.age_estimate.estimated_at: must be YYYY-MM-DD")
    elif status == "unknown":
        if birth_date is not None or estimate is not None:
            issues.append(f"{prefix}: unknown age must not include a birth date or an estimate")
        if precision != "unknown":
            issues.append(f"{prefix}.birth_date_precision: unknown age uses precision unknown")


def _check_study_dates(record: dict, issues: list[str]) -> None:
    start = record.get("start_date")
    end = record.get("end_date")
    if isinstance(start, str) and _parse_date(start) is None:
        issues.append("$.start_date: must be YYYY-MM-DD")
    if isinstance(end, str):
        end_date = _parse_date(end)
        start_date = _parse_date(start) if isinstance(start, str) else None
        if end_date is None:
            issues.append("$.end_date: must be YYYY-MM-DD")
        elif start_date is not None and end_date < start_date:
            issues.append("$.end_date: must not be earlier than start_date")


def _check_species(record: dict, species_rows: list[dict], issues: list[str]) -> None:
    subject = record.get("subject")
    if not isinstance(subject, dict):
        return
    name = subject.get("species")
    known = {row["scientific_name"]: row for row in species_rows}
    if name not in known:
        issues.append(f"$.subject.species: {name!r} is not in the species dictionary")
        return
    if known[name].get("profile_status") != "initial":
        issues.append(
            f"$.subject.species: {name} is not accepted by VULS 0.1 "
            "(only the initial canine profile is accepted)"
        )


def _check_dates(record: dict, issues: list[str]) -> None:
    subject = record.get("subject") if isinstance(record.get("subject"), dict) else {}
    birth_date = subject.get("birth_date")
    if isinstance(birth_date, str) and _parse_date(birth_date) is None:
        issues.append("$.subject.birth_date: must be YYYY-MM-DD")
    age = subject.get("age")
    if isinstance(age, dict):
        estimated_on = age.get("estimated_on")
        if not isinstance(estimated_on, str) or _parse_date(estimated_on) is None:
            issues.append("$.subject.age.estimated_on: must be YYYY-MM-DD")
    observation = record.get("observation") if isinstance(record.get("observation"), dict) else {}
    observed_at = observation.get("observed_at")
    if isinstance(observed_at, str) and _parse_datetime(observed_at) is None:
        issues.append("$.observation.observed_at: must be an RFC 3339 timestamp")


def _check_observation(record: dict, concepts: dict, units: dict, issues: list[str]) -> None:
    observation = record.get("observation")
    if not isinstance(observation, dict):
        return
    concept_name = observation.get("concept")
    spec = concepts.get(concept_name) if isinstance(concept_name, str) else None
    if not isinstance(concept_name, str) or spec is None:
        if isinstance(concept_name, str):
            issues.append(f"$.observation.concept: {concept_name} is not in the 0.1 concept dictionary")
        return

    value = observation.get("value")
    unit = observation.get("unit")
    if unit == "":
        unit = None
    value_type = spec["value_type"]
    allowed_units = spec.get("allowed_units") or []

    if value_type == "number":
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            issues.append(f"$.observation.value: {concept_name} requires a number")
        else:
            _check_number_bounds(concept_name, float(value), spec, issues)
        if unit not in allowed_units:
            listed = ", ".join(sorted(allowed_units))
            if unit is None:
                issues.append(f"$.observation.unit: {concept_name} requires one of: {listed}")
            else:
                issues.append(
                    f"$.observation.unit: {unit!r} is not allowed for {concept_name}; use one of: {listed}"
                )
        elif unit not in units:
            issues.append(f"$.observation.unit: {unit} is not in the unit dictionary")
    elif value_type == "string":
        allowed_values = spec.get("allowed_values") or []
        if not isinstance(value, str):
            issues.append(f"$.observation.value: {concept_name} requires a string")
        elif allowed_values and value not in allowed_values:
            listed = ", ".join(sorted(allowed_values))
            issues.append(f"$.observation.value: {concept_name} requires one of: {listed}")
        if unit is not None:
            issues.append(f"$.observation.unit: {concept_name} does not take a unit")

    reference = observation.get("reference_range")
    if isinstance(reference, dict):
        source = reference.get("source")
        if not isinstance(source, str) or not source.strip():
            issues.append("$.observation.reference_range.source: a reference range must name its source")
        range_unit = reference.get("unit")
        if unit and isinstance(range_unit, str) and range_unit != unit:
            issues.append("$.observation.reference_range.unit: must match the observation unit")


def _check_number_bounds(concept_name: str, value: float, spec: dict, issues: list[str]) -> None:
    if spec.get("integer") and not value.is_integer():
        issues.append(f"$.observation.value: {concept_name} must be a whole number")
        return
    if "minimum_exclusive" in spec and value <= spec["minimum_exclusive"]:
        issues.append(
            f"$.observation.value: {concept_name} must be greater than {spec['minimum_exclusive']}"
        )
    if "minimum" in spec and value < spec["minimum"]:
        issues.append(f"$.observation.value: {concept_name} must be at least {spec['minimum']}")
    if "maximum" in spec and value > spec["maximum"]:
        issues.append(f"$.observation.value: {concept_name} must be at most {spec['maximum']}")


def _check_revision_fields(record: dict, issues: list[str]) -> None:
    revision = record.get("revision")
    if not isinstance(revision, dict):
        return
    kind = revision.get("revision_type")
    previous = revision.get("previous_revision_id")
    number = revision.get("revision_number")
    reason = revision.get("revision_reason")
    status = revision.get("revision_status")
    if kind == "initial":
        if previous is not None:
            issues.append("$.revision.previous_revision_id: an initial revision has no previous version")
        if number != 1:
            issues.append("$.revision.revision_number: an initial revision must be 1")
        if reason not in (None, ""):
            issues.append("$.revision.revision_reason: an initial revision does not use a correction reason")
        if status == "withdrawn":
            issues.append("$.revision.revision_status: an initial revision is not a withdrawal")
    elif kind in {"correction", "withdrawal"}:
        if not isinstance(previous, str) or not previous:
            issues.append("$.revision.previous_revision_id: a correction or withdrawal must name the previous revision")
        if not isinstance(reason, str) or not reason.strip():
            issues.append("$.revision.revision_reason: a correction or withdrawal requires a reason")
        if isinstance(number, int) and number < 2:
            issues.append("$.revision.revision_number: a correction or withdrawal must be 2 or later")
        if kind == "withdrawal" and status != "withdrawn":
            issues.append("$.revision.revision_status: a withdrawal must be withdrawn, not deleted")
        if kind == "correction" and status == "withdrawn":
            issues.append("$.revision.revision_status: a correction cannot be withdrawn; add a withdrawal revision")
    created_at = revision.get("created_at")
    if isinstance(created_at, str) and _parse_datetime(created_at) is None:
        issues.append("$.revision.created_at: must be an RFC 3339 timestamp")


def _check_permission(record: dict, issues: list[str]) -> None:
    permission = record.get("permission")
    if not isinstance(permission, dict):
        return
    uses = permission.get("permitted_uses")
    if not isinstance(uses, list) or len(uses) == 0:
        issues.append("$.permission.permitted_uses: at least one permitted use is required")
    status = permission.get("publication_status")
    licence = permission.get("licence")
    if status == "open" and not (isinstance(licence, str) and licence.strip()):
        issues.append("$.permission.licence: open records require a licence")
    if status == "private" and isinstance(uses, list) and "public_redistribution" in uses:
        issues.append("$.permission.permitted_uses: a private record cannot allow public redistribution")


def _parse_date(value: str) -> date | None:
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


def _parse_datetime(value: str) -> datetime | None:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
