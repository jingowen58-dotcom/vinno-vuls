from __future__ import annotations

import hashlib
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

from .revisions import current_observations, read_observation_files

FOLDERS = ("subjects", "studies", "enrollments", "observations")


def check_manifest(manifest_path: str | Path, dataset_dir: str | Path, schema_path: str | Path) -> list[str]:
    manifest_file = Path(manifest_path)
    root = Path(dataset_dir)
    try:
        manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"$: invalid JSON ({exc.msg})"]
    schema = json.loads(Path(schema_path).read_text(encoding="utf-8"))
    issues = _schema_issues(manifest, schema)
    if not isinstance(manifest, dict):
        return issues or ["$: manifest must be a JSON object"]
    issues.extend(_check_snapshot(manifest, root))
    return issues


def _schema_issues(manifest: object, schema: dict) -> list[str]:
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(manifest), key=lambda item: list(map(str, item.path)))
    found = []
    for error in errors:
        location = "$." + ".".join(map(str, error.absolute_path)) if error.absolute_path else "$"
        found.append(f"{location}: {error.message}")
    return found


def _check_snapshot(manifest: dict, root: Path) -> list[str]:
    issues: list[str] = []
    locks = manifest.get("files")
    if not isinstance(locks, list):
        return issues

    actual = _dataset_files(root)
    listed = {}
    for index, lock in enumerate(locks):
        if not isinstance(lock, dict):
            continue
        relative = lock.get("path")
        if not isinstance(relative, str):
            continue
        if relative in listed:
            issues.append(f"$.files[{index}].path: {relative} is listed more than once")
            continue
        listed[relative] = lock
        path = root / relative
        if not path.is_file():
            issues.append(f"$.files[{index}].path: {relative} is not in the dataset")
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if lock.get("sha256") != digest:
            issues.append(f"$.files[{index}].sha256: {relative} does not match the file bytes")
        _check_identity(index, lock, path, issues)

    missing = sorted(set(actual) - set(listed))
    for relative in missing:
        issues.append(f"$.files: {relative} is in the dataset but not locked by the manifest")

    if issues:
        return issues

    records = _read_locked_records(root, listed)
    _check_versions(manifest, records, issues)
    _check_counts(manifest, root, records, issues)
    _check_uses(manifest, records, issues)
    return issues


def _dataset_files(root: Path) -> list[str]:
    found = []
    for folder in FOLDERS:
        directory = root / folder
        if not directory.is_dir():
            continue
        for path in sorted(directory.glob("*.json")):
            found.append(path.relative_to(root).as_posix())
    return found


def _check_identity(index: int, lock: dict, path: Path, issues: list[str]) -> None:
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        issues.append(f"$.files[{index}].path: {lock.get('path')} is not valid JSON")
        return
    if not isinstance(record, dict):
        return
    if record.get("record_type") != "observation":
        if lock.get("record_id") is not None or lock.get("revision_id") is not None:
            issues.append(f"$.files[{index}]: only observation files have record_id and revision_id")
        return
    if lock.get("record_id") != record.get("record_id"):
        issues.append(f"$.files[{index}].record_id: does not match {path.name}")
    revision = record.get("revision")
    expected = revision.get("revision_id") if isinstance(revision, dict) else None
    if lock.get("revision_id") != expected:
        issues.append(f"$.files[{index}].revision_id: does not match {path.name}")


def _read_locked_records(root: Path, listed: dict[str, dict]) -> list[tuple[Path, dict]]:
    rows = []
    for relative in sorted(listed):
        record = json.loads((root / relative).read_text(encoding="utf-8"))
        if isinstance(record, dict):
            rows.append((root / relative, record))
    return rows


def _check_versions(manifest: dict, records: list[tuple[Path, dict]], issues: list[str]) -> None:
    expected = manifest.get("vuls_version")
    for path, record in records:
        if record.get("vuls_version") != expected:
            issues.append(f"$.vuls_version: {path.name} declares {record.get('vuls_version')}, not {expected}")
    study_ids = {
        record.get("study_id")
        for _path, record in records
        if record.get("record_type") == "study" and isinstance(record.get("study_id"), str)
    }
    declared = manifest.get("study_ids")
    if isinstance(declared, list) and set(declared) != study_ids:
        issues.append("$.study_ids: does not match the study files in this dataset")


def _check_counts(
    manifest: dict,
    root: Path,
    records: list[tuple[Path, dict]],
    issues: list[str],
) -> None:
    subject_count = sum(1 for _path, record in records if record.get("record_type") == "subject")
    if manifest.get("subject_count") != subject_count:
        issues.append(f"$.subject_count: expected {subject_count}")
    observations = [(path, record) for path, record in records if record.get("record_type") == "observation"]
    current = current_observations(observations)
    if manifest.get("observation_count") != len(current):
        issues.append(
            f"$.observation_count: expected {len(current)} current observations, not historical versions"
        )
    if not (root / "observations").is_dir():
        issues.append("$.files: dataset has no observations directory")


def _check_uses(manifest: dict, records: list[tuple[Path, dict]], issues: list[str]) -> None:
    observations = [record for _path, record in records if record.get("record_type") == "observation"]
    if not observations:
        issues.append("$.files: no observation is locked")
        return
    allowed = None
    for record in observations:
        uses = set((record.get("permission") or {}).get("permitted_uses") or [])
        allowed = uses if allowed is None else allowed & uses
    declared = set(manifest.get("permitted_uses") or [])
    extra = sorted(declared - (allowed or set()))
    if extra:
        issues.append(
            "$.permitted_uses: the manifest grants "
            + ", ".join(extra)
            + ", which a locked observation does not allow"
        )
    if manifest.get("publication_status") == "open" and not manifest.get("licence"):
        issues.append("$.licence: an open manifest requires a licence")
