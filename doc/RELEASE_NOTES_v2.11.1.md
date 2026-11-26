# HymnFlow v2.11.1 — A Clearer Setup Page

**Release date**: 2026-11-26

A small follow-up to v2.11.0 that makes first-time setup easier. There are no changes to how the dock or overlay work, and your hymns, services, settings and Bibles are untouched.

---

## 📦 Quick Setup, easier to follow

Thanks to **@CiteClimb** ([PR #6](https://github.com/ebena107/HymnFlow/pull/6)) for pointing out what was confusing.

- **The right menu path.** Current OBS uses `Docks → Custom Browser Docks…` (OBS 28–29: `View → Docks → …`). It is now correct on the setup page and in every guide.
- **Clear entry fields.** The page explains the OBS dialog (double-click the empty row) and shows each field and what to type in a small table, with **Copy** buttons for the dock and overlay addresses.
- **No more double numbering** ("1. 1. Add Custom Dock").
- **"What's New" moved** below Troubleshooting, so you reach the setup steps first.
- Import steps now say to **drop the file anywhere on the dock**.
- Tables on the setup page no longer make it scroll sideways on a narrow screen.

**Upgrade**: replace `obs-setup.html` (or the whole folder). Nothing else changed. Full details: [CHANGELOG](https://github.com/ebena107/HymnFlow/blob/master/doc/CHANGELOG.md).
