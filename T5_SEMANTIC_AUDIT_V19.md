# V19 — T5 Semantic Ambiguity Audit

## Findings and actions

1. `H3-174-ex01-T5` — `到机场以后，我才发现忘记带___了。`
   - Correct target: `行李箱`
   - Keep active, but exclude `护照` and `包` from this item's distractor options because either can plausibly be forgotten at an airport.
2. `H3-163-ex01-T5` — `我忘记带___了。`
   - Disabled T5 instance: the sentence has too little context to distinguish `筷子` from many other objects.
3. `H3-176-ex01-T5` — `我到公司以后才发现忘记带___了。`
   - Disabled T5 instance: several personal/work objects could fit.
4. `H3-178-ex01-T5` — `我的___放在桌子上，你找到了吗？找到了，请帮我送到机场。`
   - Disabled T5 instance: several travel-related objects could fit the context.

Only these T5 records were changed. Other exercise types for the same words remain available. T2 listening items are not disabled by this audit because the audio itself identifies the target word.

## Validation
- Total exercise records remain 3,864.
- T4 enabled count remains 126.
- The V18 per-item exclusion behavior remains active.
- JavaScript syntax, JSON embedding parity, audio file counts, and ZIP integrity are checked during build.
- This is a targeted semantic audit, not a guarantee that all 644 T5 items have been linguistically reviewed.
