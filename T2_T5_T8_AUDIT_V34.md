# V34 — Targeted T2/T5/T8 quality audit

## Scope
Targeted audit of active T2 (listening cloze), T5 (context cloze), and T8 (sentence-to-Vietnamese meaning) records. This is a structural and targeted ambiguity check, not a full manual review of all 1,932 records.

## Findings
- T2 active records: 589/644. Every active record has a target and blank, exactly one `___`, and replacing it with the target reproduces the source sentence. Existing `target_not_found` and `target_not_unique` records remain disabled.
- T5 active records: 585/644. Same structural check passed for every active record. No duplicate active blank sentence was found with different correct targets.
- Existing ambiguous T5 cases remain disabled: `H3-056-ex02-T5`, `H3-163-ex01-T5`, `H3-176-ex01-T5`, `H3-178-ex01-T5`.
- `H3-174-ex01-T5` keeps its per-item exclusions for `护照` and `包`.
- T8 active records: 644/644; no active record has an empty Vietnamese translation.
- One identical Chinese sentence has two slightly different Vietnamese translations: `今天可能会下雨，你记得带雨伞啊。` Both translations are semantically consistent, so no change was made.

## Decision
No additional exercises were disabled or modified in this audit. Existing user-tested fixes remain intact. This preserves the current item set while documenting checks and avoiding unsupported language changes.

## Validation
Automated checks cover T2/T5 blank reconstruction, T8 translation presence, embedded JSON parity, JavaScript syntax, service-worker cache version, and ZIP integrity. Browser-based testing remains necessary for actual option generation and audio playback.
