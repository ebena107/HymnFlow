# Releasing HymnFlow

One command runs the whole release: preflight checks → version bump → build →
tag → push → GitHub release.

```bash
python scripts/release.py 2.9.0 --publish
```

(`scripts/release.bat` and `scripts/release.sh` are thin wrappers around the
same script.)

## Before you run it

The script refuses to release until these exist — write them first:

1. **`doc/CHANGELOG.md`** — a `## [X.Y.Z] - YYYY-MM-DD` section for the new
   version at the top.
2. **`doc/RELEASE_NOTES_vX.Y.Z.md`** — the GitHub release body. Its H1 becomes
   the release title.
3. **Bible data on disk** — `public/data/bible-*.js` files are git-ignored;
   regenerate with `scripts/scrape_bible_api.py` if missing.

Everything else (version strings, dates, zips, tag, GitHub release) is
automated.

## Usage

| Command | What it does |
|---|---|
| `python scripts/release.py 2.9.0` | bump → build → verify → tag (local only) |
| `python scripts/release.py --minor` | same, auto-computing the next minor version |
| `python scripts/release.py 2.9.0 --publish` | … then push master + tag and create the GitHub release with all three zips |
| `python scripts/release.py --rebuild` | rebuild artifacts for the **current** version — no bump, no tag (useful after cleaning zips) |
| `python scripts/release.py 2.9.0 --dry-run` | print the plan, change nothing |
| `--yes` | skip the confirmation prompt |

## What the preflight checks catch

- dirty working tree, wrong branch, tag already taken
- JS syntax errors in every shipped script (`node --check`)
- missing bundle inputs (Bibles, hymn collections, docs)
- missing CHANGELOG section or release notes file
- `gh` not installed / not authenticated (only with `--publish`)

## Version bumping

The script rewrites the version in:

- `package.json`
- `public/obs-dock/index.html` (cache busters)
- `public/obs-dock/obs-dock.js` (KJV seed cache buster)
- `public/obs-setup.html` (title, cache busters, dated badge, footer)

and verifies no stale references remain before committing
`chore(release): bump to vX.Y.Z`.

## Artifacts

| Zip | Contents |
|---|---|
| `hymnflow-vX-lite.zip` | plugin + default KJV |
| `hymnflow-vX-full.zip` | plugin + all Bibles (incl. the six curated translations) + all hymn collections |
| `hymnflow-vX-data.zip` | importable Bibles + hymn collections only |

The full bundle is opened and checked after building: correct version refs,
release notes present, expected Bible count.

## Publishing behavior

`--publish` pushes `master` + the tag, then:

- if no GitHub release exists for the tag → creates it with the notes file
  and all three zips;
- if one **already exists** (e.g. pre-created in the web UI) → replaces its
  title/notes with the correct ones and uploads the zips alongside any
  existing assets.

So there is no need to pre-create the release in the browser — but doing so
no longer causes stale notes either.

## If something fails halfway

- **Preflight failure** — nothing has changed; fix the issue and rerun.
- **After the bump commit but before the tag** — the commit is fine to keep;
  rerun with the same version (the bump becomes a no-op) or
  `git reset --hard HEAD~1` to undo.
- **Tag created but publish failed** — rerun with `--rebuild` to restore the
  zips if needed, then push and create the release manually (the script
  prints the exact commands), or delete the local tag and rerun.
