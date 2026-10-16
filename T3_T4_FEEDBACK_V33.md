# T3/T4 feedback fixes — V33

## T3, lesson 20
- Added `H3-309-ex01` to the existing narrow gender-variant allowlist.
- The audio sentence `他讲的故事难分真假。` now accepts `她讲的故事难分真假。` as an alternative transcription because the audio does not distinguish 他/她.
- This does not permit 它 or expand the rule to unrelated items.

## T4 sentence ordering
- Updated `H3-308-T4` tokenization from `我吃完 / 一碗饭 / 以后 / ...` to `我吃完 / 一碗饭以后 / ...`.
- The change reduces the misleading interchangeability between `一碗饭` and `一碗面条`.

## Validation
- Automated checks cover exact token reconstruction, embedded JSON equality, JavaScript syntax, cache version, and ZIP integrity.
- Browser interaction/audio still needs user smoke testing.
