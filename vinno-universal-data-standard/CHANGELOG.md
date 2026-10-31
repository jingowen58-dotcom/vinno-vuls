# Changelog

## 0.2.4 — draft

Dataset manifests lock a snapshot without renumbering the records.

- `dataset_version` is separate from `vuls_version`. Records remain `0.2.0`.
- `observation_count` counts current observations. Historical revision files stay in the file list.
- Each locked file has a SHA-256 checksum and, for observations, `record_id` and `revision_id`.
- A manifest cannot grant a use that a locked observation does not allow.
- Datasets without a manifest can still be validated.

## 0.2.3 — draft

Immutable revision history for one real observation.

- Optional `revision` on a 0.2 observation. `record_id` remains the stable observation id. `revision_id` identifies one stored version.
- A correction or withdrawal is a new file. The earlier file keeps its value. There is no second weighing and no silent overwrite.
- Chains are linear. The latest correction is `current`, earlier versions are `superseded`, and a withdrawal is `withdrawn` rather than deleted.
- Records that have no `revision` stay valid and are not assigned a fake history.
- Adding a use that the previous version did not allow is a review item. A revision does not grant new permission.

## 0.2.2 — draft

Optional device and review details. Existing names stay in place.

- `method.instrument` remains a short device name. `method.instrument_detail` may add an id, type, manufacturer, model, and calibration. A weight record may use either one.
- `quality.reviewed_by` and `quality.reviewed_at` record a pseudonymous review. `entered_at` is still the recording time; it is not renamed to `recorded_at`.
- A calibration status of `calibrated` without a date is a review item, not an error.

## 0.2.1 — draft

Measurement context, without changing 0.1 or 0.2 field meanings.

- `entered_at` remains the recording time. `observed_at` remains the measurement time. A later entry is allowed. A measurement time after the entry time is flagged for review and is not rejected.
- Optional `scoring_system`, `quantity_basis`, and `observation_period` explain body condition, food intake, and activity. Missing explanations are reviews or warnings, not errors, so older records stay valid.
- Optional `observer.observer_id` is a pseudonym. A malformed identifier is rejected.
- Body weight without an instrument name warns that scales may differ. Other concepts do not require an instrument.
- Stool values stay `formed`, `soft`, `loose`, and `watery`, marked as provisional `VINNO_STOOL_CATEGORY_0.1`, not a clinical score.
- Quality status may also be `flagged`. Existing statuses still mean the same thing. A quality label is not scientific accuracy.

## 0.2.0 — draft

Longitudinal links for one domestic dog.

- Added separate subject, study, and enrollment records.
- Added a 0.2 observation that cites `subject_id` and `study_id` instead of copying the dog into every row.
- Age is `known_birth_date`, `estimated`, or `unknown`. An estimate is not converted into a birth date.
- A dataset check rejects a birth date that falls after the observation, a missing subject, and an observation whose dog is not enrolled in the named study.
- VULS 0.1 records, examples, and field meanings are unchanged.

## 0.1.0 — draft

Initial canine observation envelope.

- Records one observation at a time, with method, provenance, quality, and permission.
- Accepts five canine concepts: body weight, body condition score, food intake, activity duration, and stool consistency.
- Requires a unit for quantitative concepts, taken from the concept dictionary.
- Requires `estimated_on` when an age value is stored, and does not convert age into a date of birth.
- Example records are synthetic.
- A veterinarian has not reviewed this draft. It does not define disease, lifespan, or clinical reference intervals.
