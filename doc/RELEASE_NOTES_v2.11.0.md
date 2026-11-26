# HymnFlow v2.11.0 — Drop Anything, in Your Language

**Release date**: 2026-11-26

Getting content into HymnFlow no longer needs scripts or file juggling, and the whole dock now speaks your language.

---

## 📥 Drop anything onto the dock

- **Drop a file anywhere** — a Bible (`.zip`, `.json`, or USFM text), hymns, a service schedule or a backup. HymnFlow works out what it is, unzips and converts it, and names it for you. Several files at once are fine.
- **Bibles**: drop the downloaded BibliaTodo NTBT/BTNT/NTB-BR zip, an eBible USFM zip, or a HymnFlow/BibliaTodo JSON file. Footnotes and markup are stripped; partial Bibles (such as a New Testament) are accepted.
- **Hymns**: plain lyrics from SongSelect or Hymnary, ChordPro (`.cho`, `.chordpro`) and CCLI `.usr` files import with copyright and CCLI numbers filled in.
- **Get another translation** (Library → Bible) lists recommended sources by language with their license and plain steps. HymnFlow itself downloads nothing.

## 🌍 Fully translated, and starts in your language

- About 180 labels, placeholders, tooltips, accessibility labels and messages that were stuck in English now come from the translation files in all 9 languages (English, Spanish, French, Portuguese, Swahili, Tagalog, Yoruba, Chinese, Korean).
- On first launch the dock follows your browser's language. A language you choose in Style → Settings always wins.
- The Swahili, Tagalog and Yoruba text would benefit from native review — corrections are welcome ([how to help](https://github.com/ebena107/HymnFlow/blob/master/doc/TRANSLATING.md)).

## ©️ Copyright, CCLI and your records

- Copyright and CCLI number per hymn, shown on the Live tab.
- A usage log of what went on screen, and a one-click CSV report for CCLI reporting. The log now travels with your backups.
- A **Licensing & credits** panel with the livestream-licensing note, the running version, and the credit lines for any BibliaTodo or LSV translation you have loaded.

## 🛡️ Security and reliability

- Strict Content Security Policy; hymn and service ids are sanitized on load.
- GitHub Actions are pinned to exact commits, and releases run the tests before packaging.
- The service "More" menu is no longer clipped in a narrow dock.
- Install steps in the README and setup guide now match the folders inside the release zip (`obs-dock/…`, not `public/obs-dock/…`).
- Buttons and badges meet the accessibility contrast minimum, and the header message bar is neutral instead of permanently red and pulsing.
- Dropping several per-book USFM files together now makes one Bible instead of one per file.
- The service Delete button now says "Delete" (it said "Del"), and the menus, item buttons, empty-list messages, Bible lookup errors and import results all follow your language.

## ⚠️ Good to know

- No hymn collections or Yoruba Bible are bundled. Churches import their own files — now just by dropping them on the dock.
- Your hymns, services, settings and Bibles live in the browser's storage and are not touched by an upgrade.

Full details: [CHANGELOG](https://github.com/ebena107/HymnFlow/blob/master/doc/CHANGELOG.md).
