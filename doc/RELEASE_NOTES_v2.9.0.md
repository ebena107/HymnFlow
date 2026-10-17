# HymnFlow v2.9.0 — Solo-Operator Workflow & Data Safety

**Release date**: 2026-10-17

Built for the person running the service alone: fewer clicks at the moments that matter, safer mistakes, and a guarantee that your hymns, services and settings can't quietly disappear.

---

## ⌨️ One-key live control

- **`B`** blank · **`C`** chorus · **`X`** Emergency Clear · **`Z`** restore · **`1`–`9`** jump to verse · **`?`** cheat sheet
- **Four new OBS global hotkeys**: Blank Screen, Emergency Clear, Show Chorus, Restore Last Slide. Reload the updated `hymnflow-obs-hotkeys.py` in OBS; your existing bindings are kept.
- **Verse chips** under the verse info for direct jumps, and a **"Global hotkeys: on/off"** chip that opens the OBS setup when tapped.
- Shortcuts now ignore Ctrl/Cmd/Alt combinations, dropdowns and open dialogs.

## 🛡️ Fewer live mistakes

- **Restore after Blank / Clear** — a toast and a button bring back the hymn position and scripture page that were on screen.
- **End-of-item guard** — on the last verse the first Next arms the advance; the second moves to the next service item. Switch off in Style → Settings.
- **Dividers are marked** "screen goes dark" in the service list and the Next hint.
- **Auto-display planned scripture** is now also on the Live tab.
- Native `alert()` / `confirm()` popups replaced by in-dock toasts and a keyboard-friendly confirm dialog.

## 🗄️ Your data is protected

- **Unreadable stored data is quarantined, not overwritten** (copy kept as `hymnflow-corrupt-*`). Previously a damaged hymn library was silently replaced with the defaults.
- **Automatic snapshot** of hymns, services and settings every time the dock opens (two kept; never taken from unreadable data).
- **Undo** for deleting a hymn or a service.
- **Style → Data & Backup**: export a full backup file, restore from a file, or restore an automatic snapshot. Restores ask first and keep a "before last restore" copy. The OBS password and connection details are never written to a backup file.
- No migration needed — new settings fall back to defaults, existing data is untouched.

> Large hymn libraries (over ~400 KB) are not copied into automatic snapshots to avoid filling browser storage — use the backup file for those. Bibles are stored separately and are not part of backups.

---

## Artifacts

| File | Contents |
|---|---|
| `hymnflow-v2.9.0-lite.zip` | plugin + default KJV + default hymnal (nnbh) |
| `hymnflow-v2.9.0-full.zip` | plugin + all Bibles + all hymn collections |
| `hymnflow-v2.9.0-data.zip` | importable Bibles + hymn collections only |

## Upgrade notes

- No breaking changes. Settings, services and imported Bibles are preserved.
- To get the new global hotkeys, reload the script in OBS (Tools → Scripts) and bind the four new actions in Settings → Hotkeys.
- New strings are English-only for now; other languages fall back to English.
