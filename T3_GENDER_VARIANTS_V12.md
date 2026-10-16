# T3 Gender Variant Fix V12 — V28

## Reported issue
Two T3 listening dictation sentences allow either 他 or 她 because the audio does not identify the written gender character.

## Change
Added only these two example IDs to the existing narrow 他/她 substitution allowlist:
- `H3-102-ex01`: 今天他又迟到半个小时，现在还在经理办公室，还没出来。
- `H3-106-02-ex02`: 我的中文比她差很多。

The checker still accepts only a direct 他 ↔ 她 substitution for allowlisted examples. It does not allow 它 substitutions or broaden this rule to all T3 items. T4 is unchanged in this build.

## Validation
JavaScript syntax and the target example IDs were checked automatically. Browser interaction/audio should still be smoke-tested.
