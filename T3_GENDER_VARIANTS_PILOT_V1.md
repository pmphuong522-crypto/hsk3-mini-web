# T3 Gender Pronoun Variant Pilot V1

## Scope
A narrow allowlist of 12 reviewed T3 example IDs accepts the direct `他` ↔ `她` substitution. The canonical Exercise Bank is unchanged. `它` is not automatically accepted. Punctuation and whitespace normalization remain unchanged.

## Pilot examples
- H3-005-ex02 — 他一直等着你。
- H3-060-ex01 — 他站在那边看着我。
- H3-081-ex01 — 她说得太快了，我突然听不明白了。
- H3-084-ex01 — 他刚才说得太快，我听不清楚。
- H3-094-ex02 — 他还没写完作业就睡着了。
- H3-098-ex02 — 他走了多久了？
- H3-115-ex02 — 再等一会儿吧，他可能快到了。
- H3-119-ex01 — 他几乎不喝可乐，因为喝太多可乐对身体不好。
- H3-120-ex01 — 他这几年几乎没有什么变化。
- H3-121-ex01 — 他以前不喜欢运动，现在每天都运动，身体越来越健康了。
- H3-149-ex02 — 他主要是想换工作环境。
- H3-182-ex02 — 他才学了一个月，就会画很多东西了。

## Grading contract
1. The canonical answer remains correct.
2. For allowlisted examples only, a full direct `他`/`她` substitution is also correct.
3. Missing/extra non-punctuation characters remain incorrect.
4. Non-allowlisted T3 examples remain strict.
5. No automatic `它` substitution and no broad homophone acceptance.

## Verification
JavaScript syntax and focused unit cases were checked for all 10 allowlisted examples: canonical answer accepted, direct 他/她 variant accepted, unrelated character omission rejected, and unlisted example does not receive the variant allowance. Browser verification should still be done by the user before replacing V9.

## V11 expansion
The two additional examples H3-119-ex01 and H3-121-ex01 were added after user browser testing showed the direct 他/她 variants were still graded wrong. Only these two example IDs were added; no global 他/她 substitution was enabled.
