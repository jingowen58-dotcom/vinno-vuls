# VINNO data validator

Checks a VULS 0.1 JSON record, and checks that a VULS 0.2 dataset links each observation to an enrolled dog.

The JSON Schema checks the envelope. This tool also checks the concept dictionary: species, value type, allowed units, stool words, numeric bounds, dates, and the rule that an open record names a licence.

It does not decide whether a dog is healthy.

A record can be `VALID` and still print `WARNING` or `REVIEW`. Only `ERROR` makes the command exit with status 1. A warning means the measurement context is incomplete. A review item needs a person to look at it. Neither one rewrites or drops the record.

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

## Use

```bash
vuls validate \
  ../vinno-universal-data-standard/examples/valid/canine-body-weight.json \
  --schema ../vinno-universal-data-standard/schemas/observation-record.schema.json \
  --dictionaries ../vinno-universal-data-standard/dictionaries

vuls validate-directory \
  ../vinno-universal-data-standard/examples/valid \
  --schema ../vinno-universal-data-standard/schemas/observation-record.schema.json \
  --dictionaries ../vinno-universal-data-standard/dictionaries
```

`validate-directory` prints every file and returns exit code 1 if any record fails.

Read a revision chain without changing it:

```bash
vuls show-history weight-2026-02-01 \
  --dataset ../vinno-universal-data-standard/examples/datasets/synthetic-weight-revision

vuls export-current \
  --dataset ../vinno-universal-data-standard/examples/datasets/synthetic-weight-revision
```

Check a dataset manifest without editing the records:

```bash
vuls check-manifest \
  ../vinno-universal-data-standard/examples/datasets/synthetic-weight-revision/manifest.json \
  --dataset ../vinno-universal-data-standard/examples/datasets/synthetic-weight-revision \
  --schema ../vinno-universal-data-standard/schemas/0.2/dataset-manifest.schema.json
```

Check a longitudinal dataset:

```bash
vuls validate-dataset \
  ../vinno-universal-data-standard/examples/datasets/synthetic-weight-follow-up \
  --schemas ../vinno-universal-data-standard/schemas/0.2 \
  --dictionaries ../vinno-universal-data-standard/dictionaries
```
