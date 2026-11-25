# HymnFlow v2.10.0 — Licensing Clarity, Safer Imports & Hardened Dock

**Release date**: 2026-11-26

This release makes it easier to use HymnFlow legally and safely: copyright and CCLI details travel with each hymn, imports are broader, and the dock is locked down with a strict Content Security Policy.

---

## ©️ Copyright, CCLI and licensing

- **Copyright and CCLI # fields** on every hymn, shown under the title on the Live tab.
- **Usage report** — each hymn put on screen is logged on your device (nothing is sent anywhere). **Style → Data & Backup → Export usage report (CSV)** gives you a report for CCLI reporting.
- **Licensing & credits panel** (Style tab) with the livestream-licensing note and the credit lines for loaded BibliaTodo (NTBT, BTNT, NTB-BR) and LSV translations.
- New [`CONTENT_LICENSING.md`](CONTENT_LICENSING.md) explains what is public domain, what is openly licensed and what needs permission.

## 📖 More ways to bring content in

- **BibliaTodo Bibles** (NTBT Spanish, BTNT English, NTB-BR Portuguese): import the official JSON directly via Library → Bible → Import JSON. Free license; keep the wording and credit the publisher.
- **Hymn importers**: plain-lyrics `.txt` (SongSelect or Hymnary copy-paste), ChordPro (`.cho`, `.chordpro`, `.chopro`, `.pro`, `.crd`; chords removed) and CCLI `.usr`.

## 🛡️ Security

- **Strict Content Security Policy** on the dock and overlay: no inline script and no `eval`. Inline click handlers were replaced with delegated events.
- **Safer stored data**: hymn and service ids are sanitized on load, closing a script-injection route through a crafted backup file.
- `SECURITY.md` rewritten to describe what the code actually does.
- Automated tests (`npm test`) and a CI workflow now run on every push; releases run the tests before packaging.

## ⚠️ What changed in what ships

- **No hymn collections are bundled.** Modern hymnals (Baptist Hymnal, United Methodist Hymnal, Faith We Sing) are gone because many songs are copyrighted. The CAC hymn books, Yoruba Baptist Hymnal and Yoruba Bible are also no longer distributed until their source can be verified. If you already have these files locally, keep using them via Library → Import and Bible → Import JSON.
- The default sample hymn "How Great Thou Art" is replaced with the public-domain "Rock of Ages" on fresh installs. Existing installs are unchanged.
- The Literal Standard Version is labelled as openly licensed (not public domain); the Bible license labels in the setup page were corrected.

## 🐛 Fixed

- The service "More" menu (Duplicate / Export / Delete) was clipped in a narrow dock; it now expands in place.

---

**Upgrade**: replace the plugin files. Your hymns, services, settings and Bibles live in the browser's storage and are not touched. Full details: [CHANGELOG](CHANGELOG.md).
