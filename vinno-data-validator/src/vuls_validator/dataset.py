from __future__ import annotations

import json
from pathlib import Path

from .dictionaries import load_dictionaries
from .revisions import check_revision_chains
from .validator import _parse_date, _parse_datetime, validate_record

SCHEMA_FILES = {
    "subject": "subject.schema.json",
    "study": "study.schema.json",
    "enrollment": "enrollment.schema.json",
    "observation": "observation-record.schema.json",
}
FOLDERS = {
    "subject": "subjects",
    "study": "studies",
    "enrollment": "enrollments",
    "observation": "observations",
}


def validate_dataset(
    directory: str | Path,
    schema_dir: str | Path,
    dictionary_dir: str | Path,
) -> dict[Path, list[str]]:
    root = Path(directory)
    schemas = _load_schemas(Path(schema_dir))
    dictionaries = load_dictionaries(dictionary_dir)
    results: dict[Path, list[str]] = {}
    loaded: dict[str, list[tuple[Path, dict]]] = {kind: [] for kind in SCHEMA_FILES}

    for kind, folder_name in FOLDERS.items():
        folder = root / folder_name
        if not folder.is_dir():
            results.setdefault(root, []).append(f"$: missing {folder_name}/ directory")
            continue
        for path in sorted(folder.glob("*.json")):
            record, issues = _read_record(path, kind, schemas, dictionaries)
            results[path] = issues
            if isinstance(record, dict) and record.get("record_type") == kind:
                loaded[kind].append((path, record))

    _check_links(root, loaded, results)
    return results


def _load_schemas(schema_dir: Path) -> dict[str, dict]:
    schemas = {}
    for kind, filename in SCHEMA_FILES.items():
        schemas[kind] = json.loads((schema_dir / filename).read_text(encoding="utf-8"))
    return schemas


def _read_record(
    path: Path,
    expected_kind: str,
    schemas: dict[str, dict],
    dictionaries: dict,
) -> tuple[dict | None, list[str]]:
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return None, [f"$: invalid JSON ({exc.msg})"]
    if not isinstance(record, dict):
        return None, ["$: record must be a JSON object"]
    issues: list[str] = []
    kind = record.get("record_type")
    if kind != expected_kind:
        issues.append(f"$.record_type: file is in {FOLDERS[expected_kind]}/ but record_type is {kind!r}")
    schema = schemas.get(kind) if isinstance(kind, str) else None
    if schema is None:
        issues.append("$.record_type: expected subject, study, enrollment, or observation")
        return record, issues
    issues.extend(validate_record(record, schema, dictionaries))
    return record, issues


def _check_links(
    root: Path,
    loaded: dict[str, list[tuple[Path, dict]]],
    results: dict[Path, list[str]],
) -> None:
    subjects = _index(loaded["subject"], "subject_id", results)
    studies = _index(loaded["study"], "study_id", results)
    _index(loaded["enrollment"], "enrollment_id", results)
    check_revision_chains(loaded["observation"], results)

    pairs: set[tuple[str, str]] = set()
    for path, record in loaded["enrollment"]:
        subject_id = record.get("subject_id")
        study_id = record.get("study_id")
        if subject_id not in subjects:
            results[path].append(f"$.subject_id: {subject_id} does not match a subject")
        if study_id not in studies:
            results[path].append(f"$.study_id: {study_id} does not match a study")
        if isinstance(subject_id, str) and isinstance(study_id, str):
            pair = (subject_id, study_id)
            if pair in pairs:
                results[path].append("$.subject_id: this subject is already enrolled in this study")
            pairs.add(pair)

    for path, record in loaded["observation"]:
        subject_id = record.get("subject_id")
        study_id = record.get("study_id")
        subject = subjects.get(subject_id)
        study = studies.get(study_id)
        if subject is None:
            results[path].append(f"$.subject_id: {subject_id} does not match a subject")
        if study is None:
            results[path].append(f"$.study_id: {study_id} does not match a study")
        if isinstance(subject_id, str) and isinstance(study_id, str) and (subject_id, study_id) not in pairs:
            results[path].append("$.study_id: this subject has no enrollment in this study")
        if subject is not None and study is not None:
            _check_species_membership(path, subject, study, results)
            _check_birth_before_observation(path, subject, record, results)
    if not loaded["observation"]:
        results.setdefault(root, []).append("$: dataset has no observations")


def _index(
    records: list[tuple[Path, dict]],
    field: str,
    results: dict[Path, list[str]],
) -> dict[str, dict]:
    found: dict[str, dict] = {}
    for path, record in records:
        identifier = record.get(field)
        if not isinstance(identifier, str):
            continue
        if identifier in found:
            results[path].append(f"$.{field}: {identifier} is duplicated")
            continue
        found[identifier] = record
    return found


def _check_species_membership(
    path: Path,
    subject: dict,
    study: dict,
    results: dict[Path, list[str]],
) -> None:
    species = subject.get("species")
    allowed = study.get("species")
    if isinstance(species, str) and isinstance(allowed, list) and species not in allowed:
        results[path].append(f"$.subject_id: subject species {species} is not included in the study")


def _check_birth_before_observation(
    path: Path,
    subject: dict,
    observation_record: dict,
    results: dict[Path, list[str]],
) -> None:
    age_information = subject.get("age_information")
    if not isinstance(age_information, dict) or age_information.get("status") != "known_birth_date":
        return
    birth = _parse_date(age_information.get("birth_date")) if isinstance(age_information.get("birth_date"), str) else None
    observed_raw = (observation_record.get("observation") or {}).get("observed_at")
    observed = _parse_datetime(observed_raw) if isinstance(observed_raw, str) else None
    if birth is not None and observed is not None and birth > observed.date():
        results[path].append(
            f"$.subject_id: birth_date {birth.isoformat()} is after observed_at {observed.date().isoformat()}"
        )
