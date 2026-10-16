# V18 — T5 semantic distractor fix

Fixed the T5 item `H3-174-ex01-T5`:
- Source: 到机场以后，我才发现忘记带行李箱了。
- Correct answer: 行李箱
- Excluded distractor: 护照

Reason: “到机场以后才发现忘记带护照了” is also natural Chinese, so 护照 is not a fair distractor for this sentence. The exclusion is stored on this one exercise record, and the shared T2/T5 distractor generator now honors per-item `exclude_distractor_targets`. This is intentionally targeted; it does not globally remove 护照 from other questions.

Regression checks:
- Correct target remains 行李箱.
- 护照 is never selected as a distractor for this record.
- Other questions without exclusions retain the existing distractor behavior.
