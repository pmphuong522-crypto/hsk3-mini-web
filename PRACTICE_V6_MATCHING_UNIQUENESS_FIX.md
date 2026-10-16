# Practice V6 — Matching uniqueness fix (V8)

T6/T7 matching-set generation now requires all four displayed Hanzi values to be unique and all four right-column values (Vietnamese meaning or tone-marked Pinyin) to be unique. It first tries validated records from the current lesson, then widens to the full validated bank. It never silently fills a matching set with duplicate visible values. If four distinct pairs cannot be found, the question is safely rejected. Service worker cache bumped to hsk3-mini-web-v8.
