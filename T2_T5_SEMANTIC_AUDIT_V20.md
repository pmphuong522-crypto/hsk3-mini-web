# V20 — T2/T5 Targeted Semantic Audit

## Audit scope
This is a targeted follow-up to the V19 T5 ambiguity fix. It checks generic-object blanks, the airport/travel context, and the structural validity gate for T2/T5. It is not a full manual linguistic review of all questions.

## Decisions
- `H3-174-ex01-T5` — **keep_active_with_exclusions**; target `行李箱`; excluded alternatives: 护照, 包. Context: airport; both alternatives are plausible things to forget.
- `H3-163-ex01-T5` — **disabled**; target `筷子`; excluded alternatives: —. Generic 'forgot to bring ___' does not uniquely identify the target.
- `H3-176-ex01-T5` — **disabled**; target `包`; excluded alternatives: —. Several personal/work objects can fit after 'forgot to bring'.
- `H3-178-ex01-T5` — **disabled**; target `护照`; excluded alternatives: —. Several travel-related objects can fit the described context.
- `H3-300-ex01-T5` — **keep_active**; target `照相机`; excluded alternatives: —. The following clause about photographing scenery strongly supports camera.
- `H3-304-ex01-T5` — **keep_active**; target `信用卡`; excluded alternatives: —. The contrast with not being able to use cash supports credit card.
- `H3-066-ex01-T5` — **keep_active**; target `客人`; excluded alternatives: —. 'Introduce the menu to guests' is a strong context fit.
- `H3-147-ex02-T5` — **keep_active**; target `中介`; excluded alternatives: —. The collocation about finding a house and not needing an agent supports the target.

## T2 checks
- T2 reads the complete source sentence in audio; a broad context can still be acceptable if the audio clearly says the target.
- All records marked `target_not_found` or `target_not_unique` remain disabled.
- Active T2 records: 589 / 644.
- No new T2 disablements were made based only on written semantic ambiguity, because the audio is the evidence used by this exercise type.

## T5 checks
- Active T5 records: 586 / 644.
- The three underdetermined generic-object blanks from V19 remain disabled.
- The airport suitcase item excludes both `护照` and `包` as distractors.
- The distractor generator honors per-item `exclude_distractor_targets`.

## Validation
- Exercise Bank remains 3,864 records.
- T4 active records remain 126.
- All invalid target records in T2/T5 remain disabled.
- JSON embedding parity, JavaScript syntax, audio counts, and ZIP integrity checked during build.
