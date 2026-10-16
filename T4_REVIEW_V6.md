# T4 Review V6 — Batch 6

- Previously enabled: 86 records
- Newly reviewed in this batch: 20 records
- Total enabled: 106 records
- Pending: 216 records

This batch adds relatively short sentence patterns. Internal commas remain attached to the chunk immediately before them; final punctuation is stored separately. Each record was checked by exact reconstruction (`''.join(tokens) + punctuation == sentence`), chunk count (4–10), and duplicate-chunk detection.

Newly enabled IDs:
- H3-007-T4: 明天就要上课了，你作业写好了吗？
  - Tokens: 明天 / 就要 / 上课了， / 你 / 作业 / 写好 / 了吗 (final punctuation: ？)
- H3-009-T4: 今天的汉语课有很多生词，我要好好复习一下这些生词。
  - Tokens: 今天的汉语课 / 有 / 很多 / 生词， / 我 / 要 / 好好复习一下 / 这些生词 (final punctuation: 。)
- H3-015-T4: 明天我要搬家，东西很多，你能来帮我一下吗？
  - Tokens: 明天 / 我要搬家， / 东西 / 很多， / 你 / 能来 / 帮我一下 / 吗 (final punctuation: ？)
- H3-018-T4: 我的脚还很疼，不能跟你去爬山了。
  - Tokens: 我的脚 / 还 / 很疼， / 不能 / 跟你 / 去爬山了 (final punctuation: 。)
- H3-023-T4: 这位是新来的秘书，大家快来认识一下。
  - Tokens: 这位 / 是 / 新来的秘书， / 大家 / 快来 / 认识一下 (final punctuation: 。)
- H3-033-T4: 你太瘦了，要多吃点儿。
  - Tokens: 你 / 太瘦了， / 要 / 多吃点儿 (final punctuation: 。)
- H3-035-T4: 周末你想去爬山还是去看电影？
  - Tokens: 周末 / 你 / 想去 / 爬山 / 还是 / 去看电影 (final punctuation: ？)
- H3-036-T4: 外面雨下得很大，你路上小心啊！
  - Tokens: 外面 / 雨 / 下得很大， / 你 / 路上 / 小心啊 (final punctuation: ！)
- H3-069-T4: 我生病的时候，姐姐一直照顾我。
  - Tokens: 我生病的时候， / 姐姐 / 一直 / 照顾我 (final punctuation: 。)
- H3-071-T4: 我感冒了，今天不太舒服，不跟你去玩了。
  - Tokens: 我 / 感冒了， / 今天 / 不太舒服， / 不跟你 / 去玩了 (final punctuation: 。)
- H3-085-T4: 戴上眼镜以后，我看得更清楚了。
  - Tokens: 戴上眼镜以后， / 我 / 看得 / 更清楚了 (final punctuation: 。)
- H3-088-T4: 电话里讲不清楚，我们见面再说吧。
  - Tokens: 电话里 / 讲不清楚， / 我们 / 见面 / 再说吧 (final punctuation: 。)
- H3-089-T4: 老师讲得很清楚，我都听明白了。
  - Tokens: 老师 / 讲得 / 很清楚， / 我 / 都 / 听明白了 (final punctuation: 。)
- H3-093-T4: 这个公园特别安静，我们去那里聊天吧。
  - Tokens: 这个公园 / 特别 / 安静， / 我们 / 去那里 / 聊天吧 (final punctuation: 。)
- H3-097-T4: 银行离我家很近，我走路十分钟就到了。
  - Tokens: 银行 / 离我家 / 很近， / 我 / 走路 / 十分钟 / 就到了 (final punctuation: 。)
- H3-101-T4: 欢迎你来中国，以后有时间我们一起聊天。
  - Tokens: 欢迎你 / 来中国， / 以后 / 有时间 / 我们 / 一起 / 聊天 (final punctuation: 。)
- H3-107-T4: 他帮你做了这么多事，你还有什么不满意啊？
  - Tokens: 他 / 帮你 / 做了 / 这么多事， / 你 / 还有什么 / 不满意啊 (final punctuation: ？)
- H3-113-T4: 老师快要来了，你们安静一点儿。
  - Tokens: 老师 / 快要 / 来了， / 你们 / 安静一点儿 (final punctuation: 。)
- H3-114-T4: 我以前很喜欢喝可乐，现在不喝了。
  - Tokens: 我 / 以前 / 很喜欢 / 喝可乐， / 现在 / 不喝了 (final punctuation: 。)
- H3-118-T4: 这件衣服又老又不好看，我不满意。
  - Tokens: 这件衣服 / 又老又不好看， / 我 / 不满意 (final punctuation: 。)

Automated checks: exact reconstruction PASS; 4–10 chunks PASS; duplicate chunk check PASS.
Language review remains a practical pilot rather than a guarantee that every learner would find each chunk boundary ideal; continue browser testing before broadening the bank.
