# VULS 0.1.0

**Status:** draft. A veterinarian has not reviewed this version.  
**Full name:** VINNO Universal Life Science Data Standard.  
**What 0.1 actually covers:** one observation about a domestic dog. The envelope can describe method, source, quality, and permission. It does not make dogs, cats, and humans comparable, and it does not estimate health or lifespan.

中文：这是犬类单次观察记录的草案格式。它不诊断疾病，不推断还能活多久，也不把同名指标当成可以跨物种比较。

## 1. Conformance

A record conforms to VULS 0.1 when all of the following are true:

1. `vuls_version` is `0.1.0`.
2. The JSON validates against `schemas/observation-record.schema.json`.
3. `subject.species` is `Canis lupus familiaris`.
4. `observation.concept` is one of the concepts in `dictionaries/concepts.yaml`.
5. The value type matches that concept.
6. A quantitative concept includes a unit listed for that concept. Units are not converted in place.
7. `observed_at` is an RFC 3339 timestamp.
8. If `subject.age` is present, it includes `estimated_on`. Age is not a date of birth and must not be rewritten into one.
9. `permission.permitted_uses` is not empty.
10. If `publication_status` is `open`, `licence` is a non-empty string. Missing permission is not permission to publish.
11. If `reference_range` is present, it includes `low`, `high`, `unit`, and `source`. The range is the source's range, not a VULS reference interval.
12. Public examples contain no owner name, phone number, email address, or street address. `subject_id` is a pseudonym.

Schema validation alone does not check units against the dictionary. Use `vinno-data-validator` for the dictionary rules.

## 2. Non-goals

VULS 0.1 does not diagnose, treat, or predict disease. It does not estimate remaining lifespan. It does not define clinical reference intervals, certify a laboratory, or replace ethics review and consent. A shared field name is not evidence that two measurements can be pooled.

## 3. Age

Prefer `subject.birth_date` (`YYYY-MM-DD`) when it is known.

When only an approximate age is known, store `subject.age.value`, `subject.age.unit`, and `subject.age.estimated_on`. `estimated_on` is the date that age was stated. Do not store a bare age, and do not invent a birthday from it.

`life_stage`, if present, is a label from the recorder. VULS does not define the age at which a dog is senior.

## 4. Concepts in this draft

| Concept | Value | Allowed units or values |
| --- | --- | --- |
| `body_weight` | number > 0 | `g`, `kg` |
| `body_condition_score` | integer 1–9 | `score_1_9` |
| `food_intake` | number ≥ 0 | `g/day`, `kg/day` |
| `activity_duration` | number ≥ 0 | `min/day`, `h/day` |
| `stool_consistency` | string | `formed`, `soft`, `loose`, `watery` |

`stool_consistency` is an unvalidated set of ordinary words. It is not a clinical fecal chart. `body_condition_score` does not define how the recorder chose the number. `score_1_9` is an ordinal label, not a UCUM unit.

`Felis catus` is listed as planned and is rejected by this version.

## 5. Quality and permission

Quality status is `unverified`, `source_checked`, `reviewed`, or `rejected`. None of these means the value is clinically correct.

Publication status is `private`, `controlled`, or `open`. `open` means the submitter states that this record may be released under `licence`. Removing a name is not enough to make a private record open.

## 6. Versioning

Records keep the `vuls_version` they were written with. Patch releases clarify wording. Minor releases may add optional fields or dictionary entries. Breaking a field's meaning requires a new major version.

## 7. Known limits

The dictionary is five concepts for dogs. There is no laboratory panel, no microbiome record, no genetic record, and no human record. There is no health score. Extensions, if used, must be named `x_` plus lowercase letters, and they do not change the meaning of the core fields.
