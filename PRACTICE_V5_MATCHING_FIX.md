HSK3 Mini Web Practice V5 — Matching interaction fix

Changes:
- T6/T7: clicking the currently selected left item again clears selection.
- T6/T7: selecting another left item replaces the prior selection.
- T6/T7: clicking an already matched left OR right item unpairs it before grading.
- Users can repair pairs until pressing Check; after grading the interaction remains locked.
- Added a short Vietnamese hint explaining deselect/unpair behavior.
- Bumped service-worker cache name to hsk3-mini-web-v3 to avoid stale JS/CSS after deployment.

Validation:
- `node --check practice/practice.js` passed.
- Manual code-path review confirms pair removal updates both the pairs array and both items' matched styles; grading reads the updated pairs array.
