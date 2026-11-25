# Content Licensing & Compliance

HymnFlow's **software** is GPL-2.0 (see `LICENSE`). The **hymn lyrics and Bible
text** you display are separate works with their own copyright. This page
summarizes what that means in practice. It is guidance, not legal advice.

## Hymns and songs

- Only **public-domain** hymns should ship in HymnFlow's bundled data. Many
  older hymn texts are public domain; many modern songs and translations are not.
- No hymn collections are distributed. `hymn-bundle/*.json` is git-ignored, so
  collections you keep there stay local. Copyright status varies by hymn. Modern hymnals (for example recent Baptist or
  Methodist hymnals and contemporary supplements) can contain copyrighted
  songs or copyrighted arrangements/translations.
  **You are responsible for confirming that you may display a given hymn.**
- Do not add third-party song-database dumps (EasySlides, MediaShout,
  VideoPsalm `.vpc`, etc.) to the repository. `hymn-bundle/raw/` is git-ignored
  for this reason; keep such files local.
- Contributors: when adding a hymn, record its author, source and
  public-domain/copyright status.

## Bible translations

- **Public domain** (safe to use): KJV, ASV, WEB, YLT, Darby, Louis Segond 1910,
  and the other translations listed as public domain in the README.
- **Copyrighted**: for example RVR 1960 and Almeida Atualizada. Get permission
  from the publisher before using them.
- **Open license, not public domain**: the Literal Standard Version (LSV) is
  copyrighted by Covenant Press and released under an open license. Sources
  disagree on which terms apply (CC BY-SA versus more restrictive wording), so
  check [lsvbible.com](https://www.lsvbible.com/) before relying on it,
  keep the text unaltered and keep its attribution.
- **Freely licensed with conditions**: BibliaTodo (NTBT, BTNT, NTB-BR) is free
  to use and distribute under the
  [BibliaTodo license](https://www.bibliatodo.org/en/license) (the publisher
  confirmed in November 2026 that **version 1.9** is the governing agreement; the
  1.7 notice inside older download packages is superseded, and both keep the
  digital permissions). Keep the wording unchanged and give one accessible
  general credit in your documentation or app information — not beside every
  verse:
  *Santa Biblia, Nueva Traducción BibliaTodo (NTBT). Publicada por BibliaTodo Bible Society. Uso, reproducción y distribución autorizados gratuitamente conforme a la Licencia NTBT.*
  Link "BibliaTodo Bible Society" to <https://www.bibliatodo.org/es/ntbt/> (English
  BTNT: <https://www.bibliatodo.org/en/btnt/>) and keep a link to the license.
  Use is free for nonprofit and commercial purposes, including paid apps,
  subscriptions and advertising, with no royalties or fees. Printing a complete
  Bible or Testament for sale, donation or distribution needs free registration
  and written approval; that does not apply to importing or displaying Scripture
  in HymnFlow. The terms can change, so keep the version and date you rely on.
- HymnFlow does not bundle translations with restrictive licenses. What is
  bundled, and its status, is listed in the table below.

## Status of content bundled with releases

| Content | Status |
|---|---|
| KJV 1769, RV 1885, Geneva 1599, Douay-Rheims, JPS 1917 | Public domain |
| Literal Standard Version | Open license (Covenant Press) — attribution required |
| Yoruba Bible (`bible-yor.js`) | **Not distributed** (untracked and excluded from releases) until its source edition is verified. **Provenance not verified.** The wording matches the classic (Crowther-era) Yoruba Bible, whose original text is old, but later revisions (1959/1960, UBS 1969) may carry their own rights. Treat as unverified until the source edition is confirmed. |
| CAC Gospel Hymn Book, CAC Yoruba Hymn Book, Yoruba Baptist Hymnal | **Not distributed** (untracked, excluded from releases) until verified. **Provenance not verified.** Community hymnals; individual hymns, translations and the compilations may be under copyright. |

If you hold rights to any of this content, or can document its source, please
open an issue so we can update this table.

## Livestreaming

The dock has a **Licensing & credits** panel (Style tab) with this note, and a
usage log you can export as CSV (Style → Data & Backup) to help with CCLI
reporting. Record each hymn's copyright and CCLI number in its edit form.

Showing copyrighted lyrics on a livestream usually needs a streaming license
in addition to a standard church copyright license (for example CCLI or
OneLicense). Requirements differ by country and platform, so check with your
licensing provider. Public-domain hymns do not need one.

## Reporting a problem

If you believe content in this repository is used without permission, open a
private security advisory on GitHub or contact the maintainers, and we will
review and remove it promptly.
