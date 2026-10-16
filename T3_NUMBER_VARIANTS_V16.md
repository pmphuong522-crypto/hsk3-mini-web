# T3 number-format tolerance — V16

T3 now treats Arabic digits and Chinese numerals as equivalent when used before recognized number/time/counter units (for example `11点` and `十一点`, `3年` and `三年`). Punctuation/whitespace tolerance and the approved 他/她 variants remain unchanged.

The numeric normalization is deliberately scoped to T3 and to number-unit contexts. It does not globally rewrite Chinese text or make general homophones equivalent.
