# T5 Semantic Audit — V37

## Scope
Continued review of active T5 fill-in-the-blank items, focusing on generic adjective/adverb contexts where multiple words could plausibly complete the sentence. This is a conservative review of the visible sentence context; no new distractor-generation behavior was changed.

## Items disabled in V37
- `H3-194-ex01-T5` — `刚开始觉得这件事情很___，但是做起来没想到这么难。` Target: `一般`. The blank is not sufficiently constrained; other natural descriptions can fit the context.
- `H3-302-ex02-T5` — `___的事都会过去的。` Target: `难过`. Multiple near-synonymous descriptions can complete the sentence naturally, so the target is not uniquely supported.

Only these T5 records were disabled. Their other exercise types remain unchanged. All prior V36 fixes are retained.
