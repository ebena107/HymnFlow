# Security Policy

## Reporting Security Issues

**Do not** open a public GitHub issue for security vulnerabilities.

Instead, please email security concerns to: [security@yourdomain.com]

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Considerations

### Browser-Based Architecture

HymnFlow runs entirely in the browser with no backend server:

- **No network requests** - All data stored locally in localStorage
- **No user data collection** - No analytics, no tracking
- **No credentials** - No login, no authentication
- **No external dependencies** - Pure vanilla JavaScript
- **No eval() or innerHTML** - No code injection risks
- **localStorage isolation** - Data isolated to file:// origin

### localStorage Limits

- **Size limit**: ~5-10MB per browser
- **No encryption**: Data stored as plain JSON
- **Browser isolation**: Inaccessible from other origins
- **User responsibility**: Users can clear browser data anytime

### File Access

- **Same-origin policy**: Both dock and overlay must be from same origin
- **file:// protocol**: Subject to browser sandbox restrictions
- **No file write access**: Can only read via import, write to localStorage

### Recommended Practices for Users

1. **Run locally**: Use file:// URLs or localhost server for maximum security
2. **Keep OBS updated**: Use latest OBS Studio version
3. **Trust sources**: Only import hymn files from trusted sources
4. **Regular backups**: Export your hymn library periodically
5. **Browser updates**: Keep your browser updated

## Known Limitations

- **No HTTPS**: file:// URLs don't support encryption
- **No validation**: Parsers accept any file content (use trusted sources)
- **No access control**: Anyone with browser access can edit hymns
- **Data export**: Can export hymns to unsecured files
- **localStorage**: Limited to 5-10MB (not suitable for very large libraries)

## Accepted Risks

HymnFlow accepts the following trade-offs for simplicity and reliability:

- **No server** - Avoids infrastructure security issues but means no authentication
- **No database** - Avoids SQL injection but means no backup service
- **No API** - Avoids API abuse but means no remote features
- **Vanilla JS** - Avoids framework vulnerabilities but means less abstraction

## Dependencies

HymnFlow has **zero runtime dependencies**:

- No npm packages
- No external libraries
- No CDN resources
- No remote scripts

This eliminates supply chain attacks and vulnerability propagation.

## Supported Versions

| Version | Status | Support Until |
|---------|--------|---------------|
| v2.0.x | Current | ----|
| v1.x | Legacy | Dec 2024 |
| < v1.0 | Unsupported | - |

## Disclosure Policy

When a security vulnerability is reported:

1. **Acknowledgment** (within 24 hours)
2. **Investigation** (within 1 week)
3. **Fix development** (varies by severity)
4. **Release** (public after patch available)
5. **Notification** (users informed of update)

## Security Checklist

Our security practices include:

- [ ] Regular code review
- [ ] No external dependencies
- [ ] Input validation in parsers
- [ ] localStorage usage follows browser standards
- [ ] No sensitive data in code/documentation
- [ ] Regular testing in OBS
- [ ] Cross-platform testing (Windows, macOS, Linux)
- [ ] Documentation of security considerations

## Future Improvements

Planned security enhancements:

- [ ] Content Security Policy (CSP) headers
- [ ] Input sanitization in parsers
- [ ] HTTPS/localhost setup wizard
- [ ] Export encryption option
- [ ] Audit logging (local only)

## Questions?

Security questions (non-vulnerability): security@yourdomain.com

---

**Last Updated**: January 2026
