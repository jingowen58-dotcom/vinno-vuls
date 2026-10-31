# VULS 0.2.0

**Status:** draft. A veterinarian has not reviewed this version.  
**What changed:** a longitudinal set can say that several observations belong to one dog and one study.  
**What did not change:** VULS 0.1 single-observation records. Their fields mean the same thing as before.

中文：0.2 把「一只狗」「一个研究」「一次观察」分成不同文件，用编号连起来。估计年龄仍然不会被换成生日。0.1 的旧记录保持原样。

## Records

| Record | File | Role |
| --- | --- | --- |
| Subject | `schemas/0.2/subject.schema.json` | One domestic dog |
| Study | `schemas/0.2/study.schema.json` | One observational project |
| Enrollment | `schemas/0.2/enrollment.schema.json` | One dog in one study |
| Observation | `schemas/0.2/observation-record.schema.json` | One measurement at one time |

A dog may join more than one study. A study may include more than one dog. That link is an enrollment, not a field copied onto only one side.

An observation stores `subject_id` and `study_id`. It does not repeat the dog's breed or age. Checking that those identifiers exist requires the whole dataset directory.

## Age

`age_information.status` is one of:

- `known_birth_date`: `birth_date` is present, `age_estimate` is null. Precision is `exact`, `year`, or `month`.
- `estimated`: `birth_date` is null. The estimate includes a value, unit, `estimated_at`, and `estimation_method`.
- `unknown`: both the birth date and the estimate are null.

An estimate is not rewritten into a birth date. If a known birth date falls after `observed_at`, the dataset check reports an error.

## Dataset directory

```text
dataset/
  subjects/
  studies/
  enrollments/
  observations/
```

`vuls validate-dataset` checks each file, then checks that every observation names a dog and a study that are enrolled together. The same identifier must not be used twice for the same record type.

## Measurement context

`observed_at` is when the measurement happened. `entered_at` is when someone wrote it down. They may differ. Entering a value after the measurement is ordinary. If the measurement time is later than the entry time, validators flag it for review and still accept the record.

`method` is how the value was obtained. Do not add a second field named `measurement_method`; `method.method_type` and `method.method_name` already say that. `entered_at` is the recording time. Do not add `recorded_at` for the same moment.

`method.instrument` is a short device name. `method.instrument_detail` may also carry `instrument_id`, type, manufacturer, model, and calibration. Either one is enough to name a scale. Body weight with neither is a warning, because two scales need not share a precision. Stool, food, activity, and body condition do not require a device. `calibrated` without `calibration_date` is sent for review.

`quality.notes` holds a review comment. `quality.reviewed_by` is a pseudonym and `quality.reviewed_at` is when that review happened. `unverified` means not reviewed. These labels are not scientific accuracy. `provenance.source_record_id` is the original record id, and `provenance.source_uri` or `source_name` is the source reference.

`observer.observer_id` is a study pseudonym, not a person's name. `provenance` is where the value came from. A source type without a name, record id, or URI is not treated as verified.

`quality.status` may be `unverified`, `source_checked`, `reviewed`, `flagged`, or `rejected`. None of these means the number is scientifically correct.

Body condition should name `scoring_system`. Food intake may set `quantity_basis` to `offered`, `consumed`, or `unspecified`; if it is absent, the amount is not assumed to be what the dog ate. Activity duration may set `observation_period`. The units `min/day` and `h/day` already mean a one-day rate. Stool words belong to provisional `VINNO_STOOL_CATEGORY_0.1` and are not a clinical chart.

These fields are optional. Records written before they existed remain valid. Validators report warnings and review items separately from errors.

## Revisions

A file is one stored version, not a second weighing. `record_id` stays the id of the real observation. Versions live in optional `revision`:

- `revision_id` changes every version. `record_id` does not.
- `initial` is version 1 and has no previous version and no correction reason.
- `correction` and `withdrawal` name the previous version, increase the number by one, and include a reason.
- The chain is linear. Status is `superseded` when a later version exists, `current` on the latest correction, and `withdrawn` on a withdrawal. A withdrawn version is not revised again and is not deleted.
- Records without `revision` are unchanged single versions. They are not given a fabricated history.
- A new version does not grant uses the previous version did not already allow. That case is marked for review.
- The validator never rewrites a file. `show-history` and `export-current` only read.

## Dataset manifest

`manifest.json` names one snapshot. `dataset_version` belongs to that snapshot. `vuls_version` is the version declared by the records, currently `0.2.0`. Changing a dataset does not change the standard version.

`observation_count` counts current observations only. Superseded and withdrawn files remain in `files` so the history can be restored. Each file entry has a SHA-256 of the bytes on disk, plus `record_id` and `revision_id` for observations. A changed byte, a missing file, or an extra data file makes the manifest invalid.

The manifest cannot allow a use that any locked observation does not already allow. An open manifest names a licence. `check-manifest` only reads files.

A directory without a manifest can still be checked with `validate-dataset`.

## Not in this version

No quality score, no JSONL import, no feline or human profile, and no external dataset conversion. `ethics_status: reviewed` only means the recorder used that label. It is not evidence that an ethics board approved the study.

The five observation concepts are unchanged from 0.1.
