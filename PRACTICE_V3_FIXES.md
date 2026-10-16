# Practice V3 — fixes from real Bài 10 testing

## T3 — nghe câu → nhập lại câu
- Punctuation is ignored globally during grading, not only at the end.
- Whitespace is ignored.
- Therefore learners may omit or change Chinese/ASCII punctuation such as `，` `。` `,` `.` `！` `？` `；` `：` and still be correct when the Chinese content is identical.
- Extra/missing Chinese characters still make the answer wrong.

## T2/T5 — điền từ
- The correct answer source is `target`, not `hanzi`.
- Distractors are also selected by `target`.
- Exactly 4 distinct options are guaranteed when valid target data exists.
- Selection priority: same lesson + same POS → same POS in the learned scope → same lesson → full scope.
- Correct answer is always included exactly once.
