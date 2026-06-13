# /verify

Run tests, type-check, and lint, then summarize results.

## Steps

1. Run `npm test` (Jest) and capture the output.
2. Run `npx tsc --noEmit` and capture the output.
3. Run `npm run lint` and capture the output.
4. Check for leftover `console.log` statements in changed files: `git diff HEAD --name-only | xargs grep -n "console.log" 2>/dev/null`
5. Summarize results in this format:

```
## Verification Summary
- Tests: PASS / FAIL (X passed, Y failed — list test files that ran)
- TypeScript: PASS / FAIL (X errors)
- Lint: PASS / FAIL (X errors, Y warnings)
- console.log: CLEAN / FOUND (file:line)
- Issues: [list any failures with file paths and suggested fixes]
```

## Success Criteria

All tests pass, zero TypeScript errors, zero lint errors, and no leftover `console.log` statements. If anything fails, suggest specific fixes.
