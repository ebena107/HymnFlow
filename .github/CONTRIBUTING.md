# Contributing to HymnFlow

Thank you for your interest in contributing to HymnFlow! This document provides guidelines and instructions.

## Code of Conduct

Be respectful, inclusive, and professional. We're a community focused on enabling better worship experiences.

## Getting Started

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HymnFlow.git
cd HymnFlow
```

2. Run locally (no build step needed):
```bash
cd public
python -m http.server 8000
```

3. Open in browser:
- Dock: http://localhost:8000/obs-dock/
- Overlay: http://localhost:8000/obs-overlay/

### Reporting Bugs

1. Check [existing issues](https://github.com/yourusername/HymnFlow/issues)
2. Create a new issue with:
   - **Title**: Clear, descriptive summary
   - **Description**: What happened vs. what you expected
   - **Steps to reproduce**: Detailed steps
   - **Environment**: OBS version, browser, OS
   - **Screenshots/Videos**: If applicable

### Suggesting Features

1. Check [open issues](https://github.com/yourusername/HymnFlow/issues?q=label%3Afeature)
2. Create a new issue with:
   - **Title**: "Feature: [brief description]"
   - **Use case**: Why is this needed?
   - **Proposal**: How should it work?
   - **Examples**: Reference implementations or mockups

## Development Workflow

### Project Structure

```
public/
├── obs-dock/        ← Control panel (vanilla JS)
├── obs-overlay/     ← Display overlay (vanilla JS)
├── data/            ← Default hymn data
└── parsers/         ← File format parsers
```

### Key Technologies

- **Vanilla JavaScript** (no frameworks)
- **localStorage API** (no server/database)
- **CSS3** (animations, gradients)
- **OBS Browser API** (custom docks)

### Code Style

- Use ES6+ JavaScript
- Add comments for complex logic
- Keep functions small and focused
- Test manually in OBS before submitting
- No external dependencies

### Making Changes

1. Create a branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes:
   - Keep commits small and logical
   - Write descriptive commit messages
   - Test thoroughly (dock and overlay)

3. Test your changes:
   - Verify in OBS with file:// URLs
   - Test keyboard shortcuts
   - Check console for errors (F12)
   - Test with multiple hymns

4. Commit and push:
```bash
git add .
git commit -m "description of changes"
git push origin feature/your-feature-name
```

5. Create a Pull Request:
   - Clear title and description
   - Link related issues
   - Include test results
   - Request review if needed

## Areas for Contribution

### High Priority

- 🐛 Bug fixes (see [open issues](https://github.com/yourusername/HymnFlow/issues))
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⌨️ Keyboard shortcut additions

### Medium Priority

- 📥 New file format parsers (XML, MIDI, etc.)
- 🌍 Localization (translations)
- 📊 Sample hymn libraries
- 🧪 Test automation

### Lower Priority

- 🔌 OBS API integration (future)
- 🌐 Remote hymn libraries (future)
- 🎵 Music playback (future)

## Pull Request Process

1. **Update documentation** if behavior changes
2. **Test thoroughly**:
   - In OBS (both Windows and other OS if possible)
   - All keyboard shortcuts
   - Import/export if modified
3. **Follow code style** (see examples in public/)
4. **Keep commits clean** - one feature per branch
5. **Request review** - we'll provide feedback
6. **Address feedback** - respond to review comments
7. **Merge** - maintainers will merge when approved

## Documentation

When contributing code, also update:

- `README.md` - If feature is user-facing
- `.github/copilot-instructions.md` - If architecture changes
- `TROUBLESHOOTING.md` - If users might encounter issues
- Code comments - For complex logic
- `CHANGELOG.md` - Keep top section for unreleased changes

## Testing Checklist

Before submitting a PR:

- [ ] Feature works in OBS dock
- [ ] Feature works in OBS overlay
- [ ] No console errors (F12)
- [ ] Keyboard shortcuts functional (if applicable)
- [ ] Works with existing hymns
- [ ] Works with imported hymns
- [ ] Works with small/large hymn counts
- [ ] localStorage usage reasonable
- [ ] Tested on Windows (minimum)

## Release Process

Releases are managed by maintainers. When your PR is merged:

1. Changes are added to `CHANGELOG.md` (unreleased section)
2. Periodically, a new version is released
3. Follow `.github/release-checklist.md`
4. GitHub Actions automatically creates release assets

## Questions?

- 📧 Email: [contact info]
- 💬 Discussions: [GitHub Discussions]
- 🐛 Issues: [GitHub Issues]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making HymnFlow better!** 🎵
