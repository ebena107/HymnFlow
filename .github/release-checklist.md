# HymnFlow Release Checklist

Use this checklist when preparing a new release.

## Pre-Release (1-2 days before)

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with new changes
- [ ] Review all recent commits for breaking changes
- [ ] Test in OBS with file:// URLs
- [ ] Test in OBS with http://localhost URLs
- [ ] Test keyboard shortcuts (←, →, ↑, ↓, Space)
- [ ] Test hymn import (TXT and JSON formats)
- [ ] Test customization (colors, fonts, effects)
- [ ] Test on Windows (primary platform)
- [ ] Test on macOS if applicable
- [ ] Test on Linux if applicable

## Code Quality

- [ ] No console errors in dock (check browser console)
- [ ] No console errors in overlay (check browser console)
- [ ] All keyboard shortcuts functional
- [ ] All buttons functional
- [ ] Settings persist on page reload
- [ ] localStorage doesn't exceed limits with test data

## Documentation

- [ ] Update `README.md` with new features (if any)
- [ ] Update `OBS_DOCK_README.md` (if UI changed)
- [ ] Update `.github/copilot-instructions.md` (if architecture changed)
- [ ] Add migration notes to `RELEASE.md` (if breaking change)
- [ ] Review `SETUP.md` for accuracy
- [ ] Review `TROUBLESHOOTING.md` for relevance

## Release Artifacts

- [ ] Create release directory: `hymnflow-v{version}/`
- [ ] Copy essential files:
  ```
  public/obs-dock/
  public/obs-overlay/
  public/data/
  public/parsers/
  README.md
  SETUP.md
  RELEASE.md
  ```
- [ ] Create ZIP: `hymnflow-v{version}-plugin.zip`
- [ ] Test ZIP extraction and functionality

## GitHub Release

- [ ] Create git tag: `git tag v{version}`
- [ ] Create GitHub Release with:
  - [ ] Tag: `v{version}`
  - [ ] Title: `HymnFlow v{version}`
  - [ ] Release notes (from CHANGELOG.md)
  - [ ] Upload ZIP artifact
  - [ ] Upload source code (auto-generated)
- [ ] Verify download links work
- [ ] Verify ZIP extraction works

## Post-Release

- [ ] Announce release (if applicable)
- [ ] Monitor issues/feedback
- [ ] Tag issues with version label
- [ ] Mark outdated docs
- [ ] Update website (if applicable)

## Version Numbers

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR** (v2.0.0): Breaking changes
  - localStorage key changes
  - Command protocol changes
  - API restructuring
  
- **MINOR** (v1.1.0): New features
  - New customization options
  - New file formats
  - New keyboard shortcuts
  
- **PATCH** (v1.0.1): Bug fixes
  - UI/UX improvements
  - Documentation fixes
  - Performance improvements

## Rollback Plan

If critical issue discovered after release:

1. Create hotfix branch from release tag
2. Fix issue
3. Test thoroughly
4. Create new PATCH release
5. Announce hotfix (highest priority)

## Files to Update on Every Release

```
package.json               ← version
CHANGELOG.md              ← new section at top
.github/copilot-instructions.md  ← if architecture changed
README.md                 ← if features changed
OBS_DOCK_README.md       ← if UI changed
RELEASE.md               ← if setup changed
SETUP.md                 ← if setup changed
TROUBLESHOOTING.md       ← if new issues found
```

## Security Checklist

- [ ] No credentials in code
- [ ] No API keys in code
- [ ] No sensitive paths hardcoded
- [ ] No external dependencies added
- [ ] No breaking permission changes
- [ ] localStorage key names unchanged (unless intentional)

## Quality Metrics

Before release, ensure:

- **Functionality**: All features work as documented
- **Usability**: New users can set up in < 5 minutes
- **Compatibility**: Works with OBS 27+ on supported platforms
- **Performance**: No lag with 100+ hymns
- **Accessibility**: Text is readable, buttons are clickable
- **Documentation**: Clear, accurate, complete

## Example Release Notes Template

```markdown
## HymnFlow v{version}

### ✨ New Features
- [Feature description]

### 🐛 Bug Fixes
- [Bug description]
- [Bug description]

### 📚 Documentation
- [Doc improvement]

### 🔄 Internal Changes
- [Technical change]

### ⚡ Performance
- [Optimization]

### ⚠️ Breaking Changes
- [Change description] - Migration: [instructions]

### 🙏 Thanks to
- [Contributors]

### 📥 Installation
See [SETUP.md](SETUP.md) for quick setup.

### 📦 Download
- `hymnflow-v{version}-plugin.zip` - Full plugin package
- Source code (zip/tar.gz) - Development files
```
