# HymnFlow - Repository Structure

## 📁 Directory Organization

```
HymnFlow/
├── .github/
│   ├── workflows/
│   │   └── release.yml          ← GitHub Actions for automated releases
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md        ← Bug report template
│   │   ├── feature-request.md   ← Feature request template
│   │   └── question.md          ← Question template
│   ├── CONTRIBUTING.md          ← Contribution guidelines
│   ├── CODE_OF_CONDUCT.md       ← Community standards
│   ├── copilot-instructions.md  ← AI agent instructions
│   ├── release-checklist.md     ← Release process guide
│   └── release-template.md      ← Release notes template
│
├── public/                       ← User-facing files (plugin package)
│   ├── obs-dock/                ← OBS control panel
│   │   ├── index.html
│   │   ├── obs-dock.css
│   │   └── obs-dock.js
│   ├── obs-overlay/             ← OBS display overlay
│   │   ├── index.html
│   │   ├── overlay.css
│   │   └── overlay.js
│   ├── data/
│   │   ├── hymns-data.js        ← Default hymn library
│   │   ├── hymns.json
│   │   └── yoruba-hymns-sample.js
│   ├── parsers/                 ← File format parsers
│   │   ├── txtParser.js
│   │   ├── csvParser.js
│   │   └── jsonParser.js
│   └── obs-setup.html           ← Setup wizard
│
├── scripts/                      ← Utility scripts
│   ├── release.sh              ← Release script (Unix/Mac)
│   └── release.bat             ← Release script (Windows)
│
├── doc/
│   └── IMPLEMENTATION.md        ← Technical documentation
│
├── README.md                    ← Main user documentation
├── README-GITHUB.md             ← GitHub README (badges, GH-specific)
├── SETUP.md                     ← Quick setup guide (2-5 min)
├── RELEASE.md                   ← Release information & migration
├── SECURITY.md                  ← Security policy
├── TROUBLESHOOTING.md           ← Common issues & solutions
├── CHANGELOG.md                 ← Version history
├── OBS_DOCK_README.md           ← Detailed dock documentation
├── OBS_IMPLEMENTATION.md        ← Implementation details
├── STREAMLINE_SUMMARY.md        ← Architecture summary
│
├── .github/
│   ├── .markdownlint.json      ← Markdown linting rules
│   └── copilot-instructions.md ← For AI agents (in .github/)
│
├── .gitignore                   ← Git ignore patterns
├── package.json                 ← Project metadata
├── LICENSE                      ← MIT License
└── .git/                        ← Git repository
```

## 📋 Key Files Description

### User Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Overview, features, quick links | End users, developers |
| `SETUP.md` | 5-minute setup guide | New users |
| `OBS_DOCK_README.md` | Detailed features & usage | Active users |
| `TROUBLESHOOTING.md` | Common issues & solutions | Users with problems |
| `RELEASE.md` | Version info, upgrades | Users on older versions |

### Developer Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `doc/IMPLEMENTATION.md` | Technical deep-dive | Developers, contributors |
| `.github/copilot-instructions.md` | AI agent guidance | GitHub Copilot, Claude |
| `OBS_IMPLEMENTATION.md` | Feature implementation | Feature developers |
| `STREAMLINE_SUMMARY.md` | Architecture summary | New developers |

### Community & Repository

| File | Purpose | Audience |
|------|---------|----------|
| `.github/CONTRIBUTING.md` | How to contribute | Potential contributors |
| `.github/CODE_OF_CONDUCT.md` | Community standards | All participants |
| `SECURITY.md` | Security policy | Security researchers |
| `.github/ISSUE_TEMPLATE/` | Issue templates | Bug reporters, feature requesters |
| `.github/release-checklist.md` | Release process | Maintainers |

## 🎯 File Grouping by Purpose

### Plugin Package (What Gets Released)

```
Everything in public/ + these docs:
- README.md (overview)
- SETUP.md (setup instructions)
- TROUBLESHOOTING.md (help)
- SECURITY.md (security info)
```

→ Packaged as: `hymnflow-v{version}-plugin.zip`

### Development Files (Source Code)

```
Everything (full repository):
- public/ (plugin source)
- scripts/ (build/release utilities)
- .github/ (CI/CD & community)
- doc/ (technical docs)
- All documentation files
```

→ Distributed as: GitHub repository

### Distribution Artifacts

```
Created during release:
- hymnflow-v{version}-plugin.zip (plugin package)
- hymnflow-v{version}-source.zip (source code, auto-generated)
```

## 🔄 Workflow: From Development to Release

1. **Development** → Edit files in `public/` or `doc/`
2. **Documentation** → Update `.md` files and `.github/` docs
3. **Version** → Update version in `package.json` and `CHANGELOG.md`
4. **Test** → Run through release checklist in `.github/release-checklist.md`
5. **Package** → Run `scripts/release.sh` (or `.bat` on Windows)
6. **Commit** → `git add . && git commit`
7. **Tag** → `git tag v{version}`
8. **Release** → Push tag, GitHub Actions creates release with ZIP
9. **Announce** → Share release notes

## 📦 What's in Each Release

### Plugin Package (`hymnflow-v{version}-plugin.zip`)

```
HymnFlow/
├── obs-dock/        ← Control panel (ready to use)
├── obs-overlay/     ← Display overlay (ready to use)
├── data/            ← Hymn library
├── parsers/         ← Import parsers
├── README.md        ← Overview
├── SETUP.md         ← Setup instructions
├── TROUBLESHOOTING.md ← Help
└── SECURITY.md      ← Security info
```

**Size:** ~150-200KB (depends on hymn data)  
**Format:** ZIP file  
**Installation:** Extract and point OBS to the paths

### Source Code (Auto-generated by GitHub)

Includes entire repository:
- All source files
- Full documentation
- Git history
- Development configuration

## 🏷️ Version Numbering

Format: `MAJOR.MINOR.PATCH` (e.g., `v2.0.0`)

- **MAJOR** - Breaking changes (localStorage key changes, API restructure)
- **MINOR** - New features (styling options, new parsers, new shortcuts)
- **PATCH** - Bug fixes and improvements

Examples:
- `v2.0.0` - Major release with new architecture
- `v2.1.0` - New feature release
- `v2.1.3` - Bug fix release

## 🔗 Important Links

- **GitHub:** https://github.com/yourusername/HymnFlow
- **Releases:** https://github.com/yourusername/HymnFlow/releases
- **Issues:** https://github.com/yourusername/HymnFlow/issues
- **Contributing:** .github/CONTRIBUTING.md
- **License:** LICENSE (MIT)

## 📊 Repository Statistics

- **Language:** JavaScript (vanilla, no frameworks)
- **Dependencies:** 0 (no npm packages)
- **Lines of Code:** ~2000 (core plugin)
- **File Size:** ~150KB (plugin package)
- **License:** MIT (free & open source)

## 🚀 Getting Started

1. **For Users:** Read [SETUP.md](SETUP.md)
2. **For Developers:** See [doc/IMPLEMENTATION.md](doc/IMPLEMENTATION.md)
3. **For Contributors:** See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)
4. **For Security:** See [SECURITY.md](SECURITY.md)
