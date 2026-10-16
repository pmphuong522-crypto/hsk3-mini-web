# T4 Review V12 — V25

Enabled 20 additional sentence-ordering records after exact reconstruction checks. Each record has 4–10 chunks; joining the chunks reproduces the sentence without its final punctuation. Existing V24 fixes were preserved.

- T4 enabled: 206
- T4 pending: 116

## Newly enabled records
- `H3-105-T4` — 现在 / 差 / 一刻 / 八点
- `H3-109-T4` — 我 / 住在 / 五层， / 你呢
- `H3-160-T4` — 你下午 / 离开 / 办公室 / 的时候， / 把门 / 关了吗
- `H3-168-T4` — 我的笔记本 / 不知道 / 谁 / 拿走了， / 你 / 帮我 / 找一下
- `H3-169-T4` — 经理 / 刚发了 / 一封 / 电子邮件， / 大家 / 都 / 看一下吧
- `H3-171-T4` — 太阳 / 从西边 / 出来了？ / 你今天 / 怎么 / 不上班 / 啊
- `H3-172-T4` — 往西走 / 是 / 医院， / 往东走 / 是 / 学校
- `H3-173-T4` — 今天 / 小王 / 又迟到， / 昨天 / 他也 / 迟到 / 一个小时， / 让经理 / 很生气
- `H3-178-T4` — 我的护照 / 放在 / 桌子上， / 你 / 找到了吗？ / 找到了， / 请 / 帮我 / 送到 / 机场
- `H3-181-T4` — 来这里 / 工作以后， / 经理 / 教我 / 学了 / 很多东西
- `H3-191-T4` — 这些 / 都是 / 过去的事情了， / 以后 / 不要 / 再说
- `H3-192-T4` — 小张 / 经常 / 上课聊天， / 今天 / 她 / 又让 / 老师 / 生气了
- `H3-193-T4` — 我一般 / 晚上 / 八点左右 / 开始 / 学习中文， / 学到 / 九点半 / 就玩一下手机， / 然后 / 睡觉
- `H3-194-T4` — 刚开始 / 觉得 / 这件事情 / 很一般， / 但是 / 做起来 / 没想到 / 这么难
- `H3-196-T4` — 考试 / 结束了， / 同学们 / 请 / 站起来 / 离开 / 教室， / 谢谢
- `H3-201-T4` — 我每天晚上 / 都会 / 打扫 / 房间， / 所以 / 家里 / 一直 / 很干净
- `H3-202-T4` — 冰箱 / 不干净， / 里面的东西 / 也 / 很容易 / 坏
- `H3-203-T4` — 回家以后， / 我一般 / 先 / 洗澡， / 然后 / 吃晚饭
- `H3-204-T4` — 我今天 / 没有 / 去买菜， / 看一下 / 冰箱里 / 有什么 / 吃什么吧
- `H3-205-T4` — 我一般 / 下班 / 回家以后 / 就 / 洗澡， / 然后 / 学习中文

Automated validation does not replace browser-based UX review.

- Restored the unrelated `H3-061-T4` tokenization to match its actual sentence `我好饿，有什么可以吃的吗？`.
