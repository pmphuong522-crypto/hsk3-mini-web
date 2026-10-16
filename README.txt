HSK3 Mini Web V1 — Flashcard + Dictionary + PWA

Bản sạch trước khi đưa lên GitHub Pages.

Đã chốt:
- Giao diện Flashcard hiện tại được giữ nguyên.
- Dictionary có thể mở trong lúc học; click từ Hán trong câu vẫn tra được.
- Nút “Xem đáp án” chỉ hiển thị nghĩa tiếng Việt, không lặp lại câu tiếng Trung.
- Audio dùng đường dẫn tương đối: audio/word/{ID}.mp3 và audio/example/{ID}_{n2}.mp3.
- PWA: manifest.webmanifest + sw.js.

Cấu trúc audio cần đặt cùng thư mục project:
audio/word/H3-001.mp3 ...
audio/example/H3-001_01.mp3 ...

Triển khai GitHub Pages:
1. Upload toàn bộ nội dung project lên repository (không upload ZIP).
2. Đặt thư mục audio/ ở cùng cấp với index.html.
3. Settings → Pages → Deploy from a branch → main → /(root).
4. Mở URL HTTPS của GitHub Pages và test audio + Dictionary trên điện thoại.


V7 update (2026-10-10): expanded manually reviewed T4 from 6 to 26 records. 296 T4 records remain disabled pending review. Service worker cache version bumped to hsk3-mini-web-v7. See T4_REVIEW_V2.md.


V9 update (2026-10-10): T3 feedback now includes an optional “Hiện nghĩa tiếng Việt” toggle after the learner checks the answer. The Vietnamese translation is matched from the validated T8 record with the same example_id. The meaning remains hidden until requested; the button can toggle it open/closed. Service worker cache bumped to hsk3-mini-web-v9.


V12 update (2026-10-11): T4 expanded from 26 to 46 reviewed records (20 new short, single-clause sentences). 276 T4 records remained disabled pending review. Service worker cache bumped to hsk3-mini-web-v12. See T4_REVIEW_V3.md.

V13 update (2026-10-11): T4 expanded from 46 to 66 reviewed records with 20 additional phrase/chunk tokenizations. 256 T4 records remain disabled pending review. Service worker cache bumped to hsk3-mini-web-v13. See T4_REVIEW_V4.md.


V14 update (2026-10-11): T4 expanded from 66 to 86 reviewed records with 20 additional phrase-chunk tokenizations. 236 T4 records remain disabled pending review. Internal commas are attached to the preceding phrase chunk in these reviewed records. Service worker cache bumped to hsk3-mini-web-v14. See T4_REVIEW_V5.md.


V15 update (2026-10-11): T4 expanded from 86 to 106 reviewed records with 20 additional manually reviewed phrase/chunk tokenizations. 216 T4 records remain disabled pending review. Exact sentence reconstruction and 4–10 chunk checks passed. Service worker cache version bumped to hsk3-mini-web-v15. See T4_REVIEW_V6.md.

V16 update: T3 accepts Arabic digits and Chinese numerals interchangeably in recognized number/time/counter-unit contexts (e.g. 11点 / 十一点). Other character differences remain strict. See T3_NUMBER_VARIANTS_V16.md.

V17 update: T4 reviewed records increased to 126; 196 remain pending. See T4_REVIEW_V7.md.

V18 update: fixed ambiguous T5 distractor for H3-174-ex01 by excluding 护照 from that item's distractor options. See T5_SEMANTIC_DISTRACTOR_FIX_V18.md.

V19 update: targeted T5 semantic ambiguity audit; T5 valid records 586, disabled 3 ambiguous items. See T5_SEMANTIC_AUDIT_V19.md.

V20 update: targeted T2/T5 semantic audit; no additional disablements beyond V19 because T2 audio identifies target and reviewed T5 contexts were sufficiently specific. See T2_T5_SEMANTIC_AUDIT_V20.md.

V21 update: T4 reviewed records increased to 146; 176 remain pending. See T4_REVIEW_V8.md.

V22 update: T4 reviewed records increased to 166; 156 remain pending. See T4_REVIEW_V9.md.

V23 update: T4 reviewed records increased to 186; 136 remain pending. See T4_REVIEW_V10.md.

V24: fixes T5 ambiguous blank item, accepts both grammatical orders for 为什么 in T4, groups 看着我 as one chunk, and prevents same-pronunciation T1 distractors.

V25: T4 reviewed batch 12 enabled (20 additional sentence-ordering records); existing V24 quality fixes retained.

V26: T4 reviewed batch 13 enabled (20 additional sentence-ordering records); prior fixes retained.

V27: T4 reviewed batch 14 enabled (20 additional sentence-ordering records); prior fixes retained.

V28: T3 gender ambiguity fix for H3-102-ex01 and H3-106-02-ex02; T4 unchanged.

V29: T4 reviewed batch 15 enabled (20 additional sentence-ordering records); T3 gender ambiguity fix from V28 retained.

V30: T4 reviewed batch 16 enabled (20 additional sentence-ordering records); prior T3/T5/T1 fixes retained.

V31: T4 reviewed batch 17 enabled (20 additional sentence-ordering records); prior fixes retained.

V32: final 16 pending T4 records enabled after exact reconstruction checks; prior fixes retained.

V33: lesson 20 T3 他/她 alternative accepted for H3-309-ex01; T4 H3-308 chunk updated to 一碗饭以后.

V34: targeted T2/T5/T8 structural and ambiguity audit; no new exercise disablements; prior fixes retained.

V35: disabled ambiguous T5 item H3-040-ex01-T5; targeted linguistic audit report added; prior fixes retained.

V36: disabled two ambiguous T5 items H3-055-ex02-T5 and H3-276-ex01-T5; previous fixes retained.

V37: continued T5 semantic ambiguity audit; disabled H3-194-ex01-T5 and H3-302-ex02-T5; prior fixes retained.


V38 (2026-10-12): added a wrong-question review entry on the practice selection screen, account sign-in/sign-up scaffolding via Supabase, answer-event sync for signed-in users, and a teacher dashboard. Cross-device accounts and dashboard require configuration described in SETUP_SUPABASE_V38.md. Wrong-question queue is currently device-local; cloud synchronization of the queue and class management are follow-up work. Service worker cache bumped to hsk3-mini-web-v38.
