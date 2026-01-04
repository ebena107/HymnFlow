# Changelog

## [2.0.0] - 2026-01-04

### 🎯 Major Streamlining Release

**BREAKING CHANGES**: Removed server version, simplified to browser-only OBS dock/overlay approach.

### Added

- 👁️ Visual feedback for Display toggle button (icons, colors, pulsing animation)
- 📱 Responsive design for vertical/narrow displays
- 🎯 Smart verse navigation (auto-advance between verses at line boundaries)
- 🔄 Real-time auto-update on all navigation actions
- ⌨️ Enhanced keyboard shortcuts with seamless navigation

### Changed

- Combined Show/Hide into single Display toggle button
- Streamlined project to OBS dock/overlay only (removed server version)
- Updated all documentation for simplified architecture
- Improved button styling with state indicators
- Enhanced UX with clear visual feedback

### Removed

- Server version (Node.js/Express/WebSocket)
- Old control/display files
- Migration documentation
- Node.js dependencies
- All server-related code and documentation

### Technical Details

**Project Structure (Simplified)**:

```text
public/
├── obs-dock/         # Control panel
├── obs-overlay/      # Display overlay
├── data/             # Default hymns
├── parsers/          # File parsers
└── obs-setup.html    # Setup wizard
```

**Communication**: Pure browser localStorage events (no server required)

**Deployment**: Works with `file://` protocol or any static file server

---

## [1.0.0] - Initial Release

- Two-version architecture (server + client-side)
- WebSocket-based real-time communication
- Basic hymn management and display

