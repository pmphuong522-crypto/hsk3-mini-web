# V35 — Targeted linguistic quality audit

## Scope
Prioritized T5 semantic ambiguity, with a targeted scan of active generic-clothing/adjective blanks; rechecked T2/T5 structural reconstruction and T8 translation presence. This is not a full manual review of all items or all distractor combinations.

## Change
- Disabled only `H3-040-ex01-T5`: `那个穿着白色___的人走进经理的办公室了。`
- Reason: although `衬衫` is a plausible intended target, multiple clothing nouns can fit the blank, and the sentence does not uniquely identify the shirt. This would be especially confusing in a multiple-choice task.
- The same source example remains available in other exercise types; only its T5 instance is disabled.

## Additional findings
- T2 active records: 589/644; all pass the structural check that the blank contains exactly one `___` and restoring the target reproduces the source sentence.
- T5 active records after this change: 584/644; all remaining active records pass the same structural check.
- T8 active records: 644/644; none has an empty Vietnamese translation.
- `今天可能会下雨，你记得带雨伞啊。` appears with two slightly different Vietnamese translations. Both preserve the meaning, so original translations were retained rather than silently normalizing source data.
- Existing ambiguous T5 exclusions and `H3-174-ex01-T5` distractor exclusions remain intact.

## Validation
JSON/embedded JS parity, JavaScript syntax, service-worker cache key, active T2/T5 reconstruction, T8 translation presence, and ZIP integrity checked. Browser interaction and actual distractor combinations still require user testing.
