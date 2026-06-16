## Security Requirements (OWASP Top 10)

| Risk                          | Mitigation                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| A03 Injection                 | Search query sanitised (strip tags, trim, maxLength=100) before use as route param or API arg  |
| A01 Broken Access Control     | Cart and favourites actions gated behind auth check; API calls include auth token              |
| A02 Cryptographic Failures    | No sensitive user data (tokens, addresses) stored in AsyncStorage unencrypted; use SecureStore |
| A05 Security Misconfiguration | API base URL from env var, never hardcoded                                                     |
| A09 Logging Failures          | No PII logged to console in production builds  