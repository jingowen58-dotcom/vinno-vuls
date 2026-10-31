from __future__ import annotations

import json
from pathlib import Path


def read_observation_files(directory: str | Path) -> list[tuple[Path, dict]]:
    folder = Path(directory) / "observations"
    if not folder.is_dir():
        return []
    rows: list[tuple[Path, dict]] = []
    for path in sorted(folder.glob("*.json")):
        record = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(record, dict):
            rows.append((path, record))
    return rows


def check_revision_chains(
    records: list[tuple[Path, dict]],
    results: dict[Path, list[str]],
) -> None:
    groups: dict[str, list[tuple[Path, dict]]] = {}
    seen_revision_ids: dict[str, Path] = {}
    for path, record in records:
        logical_id = record.get("record_id")
        if not isinstance(logical_id, str):
            continue
        revision = record.get("revision")
        if isinstance(revision, dict):
            revision_id = revision.get("revision_id")
            if isinstance(revision_id, str):
                if revision_id in seen_revision_ids:
                    results[path].append(f"$.revision.revision_id: {revision_id} is duplicated")
                else:
                    seen_revision_ids[revision_id] = path
        groups.setdefault(logical_id, []).append((path, record))

    for logical_id, items in groups.items():
        versioned = [item for item in items if isinstance(item[1].get("revision"), dict)]
        plain = [item for item in items if not isinstance(item[1].get("revision"), dict)]
        if versioned and plain:
            for path, _record in items:
                results[path].append(
                    f"$.record_id: {logical_id} mixes a revision history with an unversioned record"
                )
            continue
        if plain:
            if len(plain) > 1:
                for path, _record in plain[1:]:
                    results[path].append(f"$.record_id: {logical_id} is duplicated")
            continue
        _check_group(logical_id, versioned, results)


def current_observations(records: list[tuple[Path, dict]]) -> list[tuple[Path, dict]]:
    grouped: dict[str, list[tuple[Path, dict]]] = {}
    chosen: list[tuple[Path, dict]] = []
    for path, record in records:
        logical_id = record.get("record_id")
        if not isinstance(logical_id, str):
            continue
        if not isinstance(record.get("revision"), dict):
            chosen.append((path, record))
            continue
        grouped.setdefault(logical_id, []).append((path, record))
    for items in grouped.values():
        chosen.extend(
            (path, record)
            for path, record in items
            if record["revision"].get("revision_status") == "current"
        )
    return chosen


def permission_reviews(records: list[tuple[Path, dict]]) -> dict[Path, list[str]]:
    reviews: dict[Path, list[str]] = {}
    grouped: dict[str, list[tuple[Path, dict]]] = {}
    for path, record in records:
        logical_id = record.get("record_id")
        if isinstance(logical_id, str) and isinstance(record.get("revision"), dict):
            grouped.setdefault(logical_id, []).append((path, record))
    for items in grouped.values():
        by_id = {
            record["revision"]["revision_id"]: (path, record)
            for path, record in items
            if isinstance(record["revision"].get("revision_id"), str)
        }
        for path, record in items:
            previous_id = record["revision"].get("previous_revision_id")
            if previous_id not in by_id:
                continue
            previous_uses = set((by_id[previous_id][1].get("permission") or {}).get("permitted_uses") or [])
            current_uses = set((record.get("permission") or {}).get("permitted_uses") or [])
            added = sorted(current_uses - previous_uses)
            if added:
                reviews.setdefault(path, []).append(
                    "$.permission.permitted_uses: this revision adds "
                    + ", ".join(added)
                    + "; a revision does not grant new uses by itself"
                )
    return reviews


def history_for(records: list[tuple[Path, dict]], observation_id: str) -> list[tuple[Path, dict]]:
    items = [item for item in records if item[1].get("record_id") == observation_id]
    if not items:
        return []
    if all(not isinstance(record.get("revision"), dict) for _path, record in items):
        return items
    by_id: dict[str, tuple[Path, dict]] = {}
    roots: list[str] = []
    children: dict[str, str] = {}
    for path, record in items:
        revision = record.get("revision")
        if not isinstance(revision, dict):
            continue
        revision_id = revision.get("revision_id")
        if not isinstance(revision_id, str):
            continue
        by_id[revision_id] = (path, record)
        previous = revision.get("previous_revision_id")
        if not previous:
            roots.append(revision_id)
        elif isinstance(previous, str):
            children[previous] = revision_id
    if len(roots) != 1:
        return items
    ordered: list[tuple[Path, dict]] = []
    seen: set[str] = set()
    cursor: str | None = roots[0]
    while isinstance(cursor, str) and cursor in by_id and cursor not in seen:
        seen.add(cursor)
        ordered.append(by_id[cursor])
        cursor = children.get(cursor)
    return ordered


def _check_group(
    logical_id: str,
    items: list[tuple[Path, dict]],
    results: dict[Path, list[str]],
) -> None:
    by_id: dict[str, tuple[Path, dict]] = {}
    for path, record in items:
        revision_id = record["revision"].get("revision_id")
        if isinstance(revision_id, str) and revision_id not in by_id:
            by_id[revision_id] = (path, record)

    children: dict[str, list[str]] = {revision_id: [] for revision_id in by_id}
    for revision_id, (path, record) in by_id.items():
        previous = record["revision"].get("previous_revision_id")
        if not isinstance(previous, str):
            continue
        if previous not in by_id:
            results[path].append(
                f"$.revision.previous_revision_id: {previous} does not match a revision of {logical_id}"
            )
            continue
        children[previous].append(revision_id)
        previous_revision = by_id[previous][1]["revision"]
        if previous_revision.get("revision_type") == "withdrawal" or previous_revision.get("revision_status") == "withdrawn":
            results[path].append("$.revision.previous_revision_id: a withdrawn revision cannot be revised again")
        previous_number = previous_revision.get("revision_number")
        number = record["revision"].get("revision_number")
        if isinstance(previous_number, int) and isinstance(number, int) and number != previous_number + 1:
            results[path].append("$.revision.revision_number: must follow the previous revision by one")

    for revision_id, (path, _record) in by_id.items():
        if _has_cycle(revision_id, by_id):
            results[path].append("$.revision.previous_revision_id: revision chain contains a cycle")
        if len(children.get(revision_id, [])) > 1:
            results[path].append(
                "$.revision.revision_id: this revision has more than one successor; branches are not supported"
            )

    roots = [
        revision_id
        for revision_id, (_path, record) in by_id.items()
        if not record["revision"].get("previous_revision_id")
    ]
    if len(roots) != 1:
        for revision_id in roots or list(by_id):
            results[by_id[revision_id][0]].append(
                f"$.revision: {logical_id} must have one initial revision"
            )

    for revision_id, (path, record) in by_id.items():
        expected = _expected_status(revision_id, children, record["revision"])
        actual = record["revision"].get("revision_status")
        if actual != expected:
            results[path].append(
                f"$.revision.revision_status: expected {expected} from the revision chain, found {actual}"
            )


def _expected_status(revision_id: str, children: dict[str, list[str]], revision: dict) -> str:
    if children.get(revision_id):
        return "superseded"
    if revision.get("revision_type") == "withdrawal":
        return "withdrawn"
    return "current"


def _has_cycle(start: str, by_id: dict[str, tuple[Path, dict]]) -> bool:
    seen: set[str] = set()
    cursor: str | None = start
    while isinstance(cursor, str) and cursor in by_id:
        if cursor in seen:
            return True
        seen.add(cursor)
        previous = by_id[cursor][1]["revision"].get("previous_revision_id")
        cursor = previous if isinstance(previous, str) else None
    return False
