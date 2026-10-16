# HSK3 Mini Web — Practice quality fixes V24

## T5 — Fill in the blank
- Disabled `H3-056-ex02-T5` (`她是一个很___的人。`) because the blank can accept multiple plausible adjectives without audio/context.
- The same pattern is disabled wherever it appears as a T5 record.

## T4 — Sentence ordering
- `H3-058-T4` accepts both `为什么你总是不记得带雨伞？` and `你为什么总是不记得带雨伞？` through explicit accepted token orders.
- `他站在那边看着我。` is tokenized as `他 / 站在 / 那边 / 看着我`.

## T1 — Listening word choice
- Distractor generation for T1 now excludes candidate words whose Pinyin matches the target when tones are ignored, so homophones and tone-only contrasts cannot appear together as answer choices.
- If there are not enough safe distractors in the same lesson, it widens to the bank while preserving the pronunciation exclusion.

## Validation scope
- Automated structure and syntax checks are run for this build.
- Browser-based interaction and real audio playback still require a manual test in the deployed/browser environment.
