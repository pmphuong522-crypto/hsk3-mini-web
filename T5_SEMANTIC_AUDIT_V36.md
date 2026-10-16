# V36 — T5 semantic ambiguity audit

## Changes
Disabled two T5 items because the written context does not uniquely support the intended answer:
- `H3-055-ex02-T5`: `他是个非常___的孩子，他英语也说得很好。` The second clause suggests ability but does not uniquely establish `聪明`; multiple compatible descriptors may fit.
- `H3-276-ex01-T5`: `我一直想去看看那个___的地方，如果以后有机会一定会去。` No location details distinguish `有名` from other natural descriptors.

Only the T5 instances were disabled. Other exercise types for the same examples remain unchanged.

## Scope and caution
This is a targeted manual review of clear ambiguity candidates, not a complete semantic audit of every T5 item or every runtime distractor combination. Previously disabled ambiguous T5 items and the per-item exclusions for `H3-174-ex01-T5` remain unchanged.

## Validation
Checked active T2/T5 blank structure, T8 translation presence, embedded JSON parity, JavaScript syntax, cache key, and ZIP integrity. Browser smoke testing is still needed.
