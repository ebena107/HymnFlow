# Content Licensing & Compliance

HymnFlow's **software** is GPL-2.0 (see `LICENSE`). The **hymn lyrics and Bible
text** you display are separate works with their own copyright. This page
summarizes what that means in practice. It is guidance, not legal advice.

## Hymns and songs

- Only **public-domain** hymns should ship in HymnFlow's bundled data. Many
  older hymn texts are public domain; many modern songs and translations are not.
- The optional `hymn-bundle/` collections are provided as a convenience. Their
  copyright status varies by hymn. Modern hymnals (for example recent Baptist or
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
- **Freely licensed with conditions**: BibliaTodo (NTBT, BTNT, NTB-BR) is free
  to use and distribute under the
  [BibliaTodo license](https://www.bibliatodo.org/en/license). Keep the wording
  unchanged and credit it once where your church lists credits:
  *Santa Biblia, Nueva Traducción BibliaTodo (NTBT). Publicada por BibliaTodo
  Bible Society.* The terms can change, so record the license version and date
  you rely on.
- HymnFlow does not bundle copyrighted or conditionally licensed translations.

## Livestreaming

Showing copyrighted lyrics on a livestream usually needs a streaming license
in addition to a standard church copyright license (for example CCLI or
OneLicense). Requirements differ by country and platform, so check with your
licensing provider. Public-domain hymns do not need one.

## Reporting a problem

If you believe content in this repository is used without permission, open a
private security advisory on GitHub or contact the maintainers, and we will
review and remove it promptly.
