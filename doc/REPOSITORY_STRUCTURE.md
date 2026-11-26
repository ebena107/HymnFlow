# HymnFlow — Repository Structure

## Directory layout

```text
HymnFlow/
├── public/                     App source. In a release zip these folders sit at the top level
│   ├── obs-dock/               OBS custom dock (control panel): index.html, obs-dock.css, obs-dock.js
│   ├── obs-overlay/            OBS browser source (on-screen display): index.html, overlay.css, overlay.js
│   ├── data/                   bible-lookup.js, hymns-data.js (+ generated Bible bundles, git-ignored)
│   ├── parsers/                txtParser, csvParser, jsonParser (hymn files),
│   │                           songParsers (plain lyrics, ChordPro, CCLI .usr),
│   │                           bibleFormats (.zip reader, USFM)
│   ├── i18n/                   translations.js (what the app loads) + one <lang>.json per language
│   ├── validation.js           hymn / service data validation
│   └── obs-setup.html          interactive setup page
│
├── scripts/                    release.py (+ release.sh / release.bat), hymnflow-obs-hotkeys.py,
│                               Bible converters and scrapers, translation combiner
├── tests/                      Node tests, run with `npm test`
├── doc/                        documentation (see below); doc/archive holds historical notes
├── .github/                    workflows (tests, release), issue templates, contributing guide
├── hymn-bundle/                local-only hymn collections (git-ignored, never distributed)
├── LICENSE                     GPL-2.0
├── package.json                project metadata and `npm test`
└── README.md
```

## Documentation

| File | Purpose |
|---|---|
| `README.md` | Overview, quick start, features |
| `doc/SETUP.md` | Step-by-step setup guide |
| `doc/OBS_DOCK_README.md` | Detailed user guide |
| `doc/TROUBLESHOOTING.md` | Common problems and fixes |
| `doc/CONTENT_LICENSING.md` | Copyright of hymns and Bible translations, livestream licensing |
| `doc/SECURITY.md` | Security policy and how the app handles files and data |
| `doc/TRANSLATING.md` | How to add or improve a language |
| `doc/CHANGELOG.md`, `doc/RELEASE_NOTES_v*.md` | Version history |
| `doc/RELEASING.md` | How to cut a release (maintainers) |
| `doc/TESTING_GUIDE.md`, `doc/DATA_MODELS.md` | Testing notes and data formats (developers) |
| `doc/archive/` | Historical planning and announcement documents |
| `.github/CONTRIBUTING.md`, `.github/CODE_OF_CONDUCT.md` | Community guides |

## What gets released

Each release publishes three zips built by `scripts/release.py` — `lite` (app + KJV), `full` (app + curated Bibles) and `data` (Bibles only) — plus a bare `plugin` zip built by CI. They contain the contents of `public/` at the top level, the key docs, and the `scripts/` needed for hotkeys. Hymn collections are not included.

## Versioning

Semantic versioning, `MAJOR.MINOR.PATCH` (for example `v2.11.0`). `scripts/release.py` stamps the version into the app, builds the zips and tags the release; see [RELEASING.md](RELEASING.md).

## License

GPL-2.0 (see `LICENSE`). Hymn lyrics and Bible text have their own copyright — see [CONTENT_LICENSING.md](CONTENT_LICENSING.md).
