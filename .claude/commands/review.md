# /review

Review the current git diff for code quality and issues.

## Checklist

Analyze the staged changes and provide findings for:

1. **Security Vulnerabilities** — Any potential security issues:
   - Hardcoded secrets, API keys, credentials
   - Authentication/authorization bypasses
   - Input validation and sanitization gaps
   - Sensitive data stored in AsyncStorage unencrypted
   - Deep link / URL scheme inputs aren’t sanitized
   - Unsafe use of `eval` or dynamic code execution

2. **Performance Issues** — Optimization opportunities:
   - Unnecessary re-renders (missing `useMemo`, `useCallback`, `React.memo`)
   - Inline styles causing re-render on every paint (move to StyleSheet or unistyles)
   - FlashList/FlatList misuse: missing `keyExtractor`, `getItemLayout`, heavy `renderItem`
   - Large bundle size increases
   - Missing memoization or caching for expensive computations
   - Unthrottled scroll/gesture event handlers

3. **Accessibility Issues** — WCAG / React Native accessibility gaps:
   - Missing `accessibilityLabel` or `accessibilityRole` on interactive elements
   - Text is not scaling with user font size settings (`allowFontScaling` disabled)
   - Insufficient color contrast
   - Missing focus management on modals/navigation transitions
   - Touchable targets smaller than 44×44pt

4. **Missing Error Handling** — Exception coverage gaps:
   - Unhandled promise rejections
   - Missing try/catch blocks
   - No null/undefined checks
   - Missing loading and error states for async operations
   - Missing timeout handling on network requests
   - Native module calls without fallback for unavailable modules

5. **Test Coverage Gaps** — Testing deficiencies:
   - New functions or components without tests
   - Edge cases aren’t covered
   - Untested error paths
   - Missing integration tests for critical flows

6. **Expo / React Native Conventions** — Project-specific checks:
   - Permissions not requested gracefully (no fallback if denied)
   - Non-responsive layouts (hardcoded px values instead of percentage-based Dimensions)
   - Styles not using unistyles
   - Animations not using react-native-reanimated
   - Forms not using react-hook-form + zod
   - Types not placed in the `types/` folder
   - New npm dependencies added without approval

## Output Format

```
## Code Review Summary

### Security
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|

### Performance
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|

### Accessibility
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|

### Error Handling
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|

### Test Coverage
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|

### Conventions
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|

### Overall: PASS / NEEDS ATTENTION
```

End with a summary: "Safe to merge" or "Recommend changes before merge".

## Notes

- Severity levels: CRITICAL, HIGH, MEDIUM, LOW
- If no issues found in a category, write "No issues found"
- Be specific about file paths and line numbers
