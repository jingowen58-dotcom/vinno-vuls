# VULS 0.1

Draft format for **one observation about a domestic dog**. It records the value, unit, time, method, source, quality, and permission. It does not diagnose disease, estimate lifespan, or treat a dog measurement as comparable to a cat or human measurement with the same name.

This version has not been reviewed by a veterinarian. Example files are synthetic.

中文说明：这是家犬单次观察的草案，不是生命科学行业标准，也不是宠物诊断工具。公开示例全部是虚构数据。猫、化验单、基因和寿命预测都不在 0.1 里。

## Layout

- `spec/VULS_0.1.0.md` — single-observation rules
- `spec/VULS_0.2.0.md` — longitudinal rules
- `schemas/observation-record.schema.json` — 0.1 structure
- `schemas/0.2/` — subject, study, enrollment, and observation
- `dictionaries/` — species, units, and the five concepts
- `examples/valid/` — synthetic 0.1 records that should pass
- `examples/invalid/` — synthetic 0.1 records that should fail
- `examples/datasets/synthetic-weight-follow-up/` — one fictional dog weighed four times

## Check the examples

From the sibling `vinno-data-validator` project:

```bash
vuls validate \
  ../vinno-universal-data-standard/examples/valid/canine-body-weight.json \
  --schema ../vinno-universal-data-standard/schemas/observation-record.schema.json \
  --dictionaries ../vinno-universal-data-standard/dictionaries
```

JSON Schema checks the envelope. The validator also checks that the concept and unit exist in the dictionary.

Check the 0.2 longitudinal example:

```bash
vuls validate-dataset \
  ../vinno-universal-data-standard/examples/datasets/synthetic-weight-follow-up \
  --schemas ../vinno-universal-data-standard/schemas/0.2 \
  --dictionaries ../vinno-universal-data-standard/dictionaries
```

## Changes

See `CHANGELOG.md`. Do not treat 0.1.0 as a stable clinical specification.
