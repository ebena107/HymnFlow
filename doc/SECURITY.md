# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue with exploit details.

Use the repository's **Security → Report a vulnerability** (GitHub private
advisory) at <https://github.com/ebena107/HymnFlow/security/advisories>. If that
is unavailable, open an issue that only says you have a security report and ask
for a private contact — include no details.

Include: what you found, steps to reproduce, impact, and a suggested fix if you
have one. We aim to acknowledge reports within a few days and to publish a fix
before public disclosure.

## How HymnFlow is built (what this means for security)

- **Runs locally in the browser.** The dock (`obs-dock`) and overlay
  (`obs-overlay`) are static pages. There is no HymnFlow server, account, or
  analytics.
- **No third-party runtime code.** No npm packages, CDN scripts, or remote
  fonts. The release package contains only HymnFlow's own files.
- **Network use.** The only connection HymnFlow makes is the optional
  **obs-websocket** link from the dock to OBS (default `127.0.0.1:4455`), used
  for global hotkeys. Everything else works offline.
- **Dock ↔ overlay messaging** uses browser `localStorage` events, so both
  pages must be loaded from the same origin in the same OBS browser profile.
- **Rendering.** The overlay writes lyrics with `textContent`. The dock builds
  some lists with `innerHTML`; user-supplied text is passed through
  `escapeHtml()` first, and ids are restricted to `[A-Za-z0-9_-]` on load,
  because they are placed in inline event handlers.
- **Content Security Policy.** Both pages forbid inline script and `eval`
  (`script-src 'self' file:`), plus `object-src 'none'`, `base-uri 'none'`
  and `form-action 'none'`. The dock may open WebSocket connections
  (`connect-src ws: wss:`, for obs-websocket); the overlay may not connect
  anywhere. Inline `style` attributes are still allowed. Dynamic lists use
  delegated `data-act` click handlers instead of inline `onclick`.

## Data stored

| Data | Where | Notes |
|---|---|---|
| Hymns, services, settings | `localStorage` | Plain JSON, not encrypted |
| Bible translations | IndexedDB | Imported by the user |
| OBS WebSocket password (optional) | `localStorage` (settings) | **Plain text**; excluded from exported backups |
| Automatic snapshots | `localStorage` | Taken when the dock opens |

Anyone with access to the OBS user profile on the machine can read this data.
Use a **dedicated** obs-websocket password (never one you use elsewhere), or on
shared machines run obs-websocket without a password bound to localhost.

## Imported files

Imports (hymn files, backups, schedules, Bible files) are validated, but they
are **data from outside the app** — only import files you trust.

- Backups and stored data have their hymn and service ids sanitized on load.
- Parsers accept `.txt`, `.csv`, `.json`, ChordPro and `.usr`; they never
  evaluate content as code.
- Bible JSON is checked for structure (66 books) but not for correctness of the
  text.

## Known limitations

- No access control: anyone who can use the dock can change hymns and settings.
- `localStorage` is limited (about 5–10 MB); very large hymn libraries may not
  fit. Back up regularly (Style → Data & Backup).
- CI runs unit and static checks only; there is no dependency or code scanning (there are no dependencies).

## Planned improvements

- [x] Strict `script-src` CSP, no inline event handlers
- [x] Automated tests and CI on every push (`npm test`, `.github/workflows/test.yml`)
- [ ] Pin GitHub Actions to commit SHAs
- [ ] Optional encryption of exported backups

## Supported versions

Only the latest release receives fixes.

**Last reviewed**: November 2026
