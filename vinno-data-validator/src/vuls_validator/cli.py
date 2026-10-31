import json
from pathlib import Path

import typer

from .context import context_findings
from .dataset import validate_dataset
from .manifest import check_manifest
from .revisions import current_observations, history_for, permission_reviews, read_observation_files
from .validator import Assessment, assess_path

app = typer.Typer(help="Validate VULS 0.1 records and 0.2 longitudinal datasets.")


@app.command()
def validate(
    record: Path = typer.Argument(..., exists=True, dir_okay=False, readable=True),
    schema: Path = typer.Option(..., "--schema", exists=True, dir_okay=False, readable=True),
    dictionaries: Path = typer.Option(..., "--dictionaries", exists=True, file_okay=False),
) -> None:
    """Validate one JSON record."""
    assessment = assess_path(record, schema, dictionaries)
    _print_assessment(record, assessment)
    if assessment.errors:
        raise typer.Exit(code=1)


@app.command("validate-directory")
def validate_directory_command(
    directory: Path = typer.Argument(..., exists=True, file_okay=False, readable=True),
    schema: Path = typer.Option(..., "--schema", exists=True, dir_okay=False, readable=True),
    dictionaries: Path = typer.Option(..., "--dictionaries", exists=True, file_okay=False),
) -> None:
    """Validate every JSON file in a directory."""
    paths = sorted(directory.glob("*.json"))
    if not paths:
        typer.echo("No JSON files found.")
        raise typer.Exit(code=1)
    failed = False
    for path in paths:
        assessment = assess_path(path, schema, dictionaries)
        _print_assessment(path, assessment)
        failed = failed or bool(assessment.errors)
    if failed:
        raise typer.Exit(code=1)


@app.command("validate-dataset")
def validate_dataset_command(
    directory: Path = typer.Argument(..., exists=True, file_okay=False, readable=True),
    schemas: Path = typer.Option(..., "--schemas", exists=True, file_okay=False),
    dictionaries: Path = typer.Option(..., "--dictionaries", exists=True, file_okay=False),
) -> None:
    """Validate a 0.2 dataset and check subject, study, and enrollment links."""
    _run_dataset(directory, schemas, dictionaries)


@app.command("check-manifest")
def check_manifest_command(
    manifest: Path = typer.Argument(..., exists=True, dir_okay=False, readable=True),
    dataset: Path = typer.Option(..., "--dataset", exists=True, file_okay=False),
    schema: Path = typer.Option(..., "--schema", exists=True, dir_okay=False, readable=True),
) -> None:
    """Check a dataset manifest against file bytes. This command does not edit records."""
    issues = check_manifest(manifest, dataset, schema)
    if issues:
        typer.echo(f"INVALID {manifest}")
        for issue in issues:
            typer.echo(f" - ERROR {issue}")
        raise typer.Exit(code=1)
    payload = json.loads(manifest.read_text(encoding="utf-8"))
    current = [
        lock.get("revision_id") or lock.get("record_id")
        for lock in payload.get("files", [])
        if lock.get("record_id")
    ]
    typer.echo(f"VALID {manifest.name}")
    typer.echo(f"dataset_version {payload.get('dataset_version')}")
    typer.echo(f"vuls_version {payload.get('vuls_version')}")
    typer.echo(f"observation_count {payload.get('observation_count')}")
    typer.echo("locked " + ", ".join(str(item) for item in current))


@app.command("validate-revisions")
def validate_revisions_command(
    directory: Path = typer.Argument(..., exists=True, file_okay=False, readable=True),
    schemas: Path = typer.Option(..., "--schemas", exists=True, file_okay=False),
    dictionaries: Path = typer.Option(..., "--dictionaries", exists=True, file_okay=False),
) -> None:
    """Check revision chains. This command does not edit records."""
    _run_dataset(directory, schemas, dictionaries)


@app.command("show-history")
def show_history_command(
    observation_id: str = typer.Argument(...),
    dataset: Path = typer.Option(..., "--dataset", exists=True, file_okay=False),
) -> None:
    """Print every stored version of one observation. This command does not edit records."""
    rows = history_for(read_observation_files(dataset), observation_id)
    if not rows:
        typer.echo(f"No observation {observation_id}")
        raise typer.Exit(code=1)
    for path, record in rows:
        revision = record.get("revision") if isinstance(record.get("revision"), dict) else {}
        observation = record.get("observation") if isinstance(record.get("observation"), dict) else {}
        typer.echo(
            " ".join(
                [
                    str(revision.get("revision_number", "-")),
                    str(revision.get("revision_status", "unversioned")),
                    str(observation.get("value", "")),
                    str(observation.get("unit") or ""),
                    str(revision.get("revision_reason") or ""),
                    path.name,
                ]
            )
        )


@app.command("export-current")
def export_current_command(
    dataset: Path = typer.Option(..., "--dataset", exists=True, file_okay=False),
) -> None:
    """Print the current observation versions as JSON lines. This command does not edit records."""
    for _path, record in current_observations(read_observation_files(dataset)):
        typer.echo(json.dumps(record, ensure_ascii=False))


def _run_dataset(directory: Path, schemas: Path, dictionaries: Path) -> None:
    results = validate_dataset(directory, schemas, dictionaries)
    reviews = permission_reviews(read_observation_files(directory))
    failed = False
    for path, issues in results.items():
        warnings: list[str] = []
        review = list(reviews.get(path, []))
        if path.is_file():
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                payload = None
            if isinstance(payload, dict):
                warnings, context_review = context_findings(payload)
                review.extend(context_review)
        _print_assessment(path, Assessment(issues, warnings, review))
        failed = failed or bool(issues)
    if failed:
        raise typer.Exit(code=1)


def main() -> None:
    app()


def _print_assessment(path: Path, assessment: Assessment) -> None:
    if assessment.errors:
        typer.echo(f"INVALID {path}")
        for issue in assessment.errors:
            typer.echo(f" - ERROR {issue}")
    else:
        typer.echo(f"VALID {path}")
    for issue in assessment.warnings:
        typer.echo(f" - WARNING {issue}")
    for issue in assessment.review_required:
        typer.echo(f" - REVIEW {issue}")
