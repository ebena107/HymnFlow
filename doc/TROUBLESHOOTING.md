# Troubleshooting

Most problems fall into one of the groups below. Your version is shown in the dock under **Style → Licensing & credits** — include it if you report a problem.

## The dock is blank, or OBS says it can't load it

- The URL must point at the real folder. If you extracted the release to `C:\HymnFlow\`, the dock URL is
  `file:///C:/HymnFlow/obs-dock/index.html` and the overlay URL is `file:///C:/HymnFlow/obs-overlay/index.html`.
  (There is no `public/` folder in a release zip; that folder only exists in a source checkout.)
- Easiest fix: open `obs-setup.html` from your extracted folder. It shows the exact URLs for your computer.
- Use forward slashes and three slashes after `file:`. A space in the folder name works but is shown as `%20`.
- After changing a dock URL, press **Apply** in *Docks → Custom Browser Docks…* (OBS 28–29: *View → Docks → Custom Browser Docks…*).

## Nothing appears on the stream

Check these in order:

1. The dock's **Display** switch is on (the **LIVE** badge shows). Press `Space` to toggle.
2. The screen was not blanked: if you pressed **Blank** or **Emergency Clear**, press `Z` (or **Restore**) to bring it back.
3. The **Browser Source** for the overlay is in the scene you are streaming, is visible (eye icon), and is 1920×1080.
4. The dock and the overlay come from **the same place**. Both must use `file://` (or both `http://`), and from the same HymnFlow folder, in the same OBS. They talk through the browser's storage, so two different copies do not see each other.
5. Style → the text colour is visible against the background (white text on a transparent background over a white video will vanish).
6. In the Browser Source, enabling *Refresh browser when scene becomes active* helps when the source was hidden while a hymn was shown.

To test outside OBS, open the dock and the overlay in two tabs of Chrome or Edge using the same kind of address; select a hymn and press **Display**. The browser's console (F12) shows any errors.

## Global hotkeys do not work

- Keyboard shortcuts (`→`, `B`, `Z`, …) only work while the dock panel has keyboard focus. For hotkeys that work from anywhere you need the OBS script.
- In OBS: *Tools → WebSocket Server Settings* (called *obs-websocket Settings* in older versions) → enable the server, note the port (default `4455`) and password.
- *Tools → Scripts* → `+` → choose `scripts/hymnflow-obs-hotkeys.py`. (OBS needs Python set up under *Scripts → Python Settings*.)
- *Settings → Hotkeys* → search "HymnFlow" and bind keys.
- In the dock: *Style → OBS Connection* → enter the same host, port and password → **Connect**. The header chip should read **Global hotkeys: on**.

## Importing files

HymnFlow works out what a file is, so you can drop it anywhere on the dock. If something goes wrong:

| What you see | What it means |
|---|---|
| "That kind of file can't be imported…" | Use a hymn file (`.txt`, `.csv`, `.json`, `.cho`, `.usr`), a Bible (`.zip`, `.json`, `.usfm`), a service schedule (`.txt`), or a HymnFlow backup (`.json`). |
| "This .zip is password-protected" | Ask the publisher for the unprotected download. |
| "no Bible text was found in this file" | The zip/file has no Bible JSON or USFM inside. Download the *JSON* or *USFM* version. |
| "Only N books found — expected 66" | The JSON Bible is incomplete. USFM files are allowed to be partial (for example a New Testament). |
| Many one-book USFM files became many translations | Drop them **together** in one go and they become one Bible. |
| "Storage full" | Hymns live in browser storage (about 5–10 MB). Export your hymns, then remove ones you don't use. Bibles are stored separately and do not count. |
| A file over 150 MB is refused | Use a smaller download (the study editions are large; the text-only Bible is about 1.5 MB). |

Imported hymn text, CCLI numbers and copyright lines are kept; chords are dropped.

## Bible lookup

- "Bible not loaded": import a translation (Library → Bible). KJV is loaded automatically on first launch.
- "Book not recognised": type the reference like `John 3:16`, `Ps 23`, `1 Cor 13:4-7` or `Juan 3:16` (book names in the nine interface languages work).
- The translation badge on the overlay shows which Bible a verse came from. Switch with the selector in the Live tab.

## Language

The dock starts in your browser's language when it is one of the nine supported, otherwise English. Change it any time in *Style → Settings → Interface Language*; your choice is remembered.

## Your data

- Hymns, services and settings are saved in the browser inside OBS; Bibles are saved separately. Nothing is sent anywhere.
- **Everything loaded from `file://` shares one storage.** Two HymnFlow folders on the same computer see the same hymns and services.
- Clearing OBS's browser data, or running OBS under a different Windows user, starts you with an empty library. Keep a backup: *Style → Data & Backup → Export backup…* (it also saves your usage history).
- A snapshot is taken every time the dock opens; *Restore selected snapshot* brings back an earlier one. Deleted hymns and services can be undone for a few seconds.
- Moving to another computer: export a backup, copy the file, and drop it onto the dock there.

## Updating

Replace the `obs-dock`, `obs-overlay`, `data`, `parsers`, `i18n` folders (and `validation.js`, `obs-setup.html`) with the new ones. Your hymns, services, settings and Bibles are stored in the browser, not in these folders, so they carry over.

## Still stuck?

[Open an issue](https://github.com/ebena107/HymnFlow/issues) and include your HymnFlow version, your OBS version, and what you expected to happen. Please do not post passwords or private files. Security problems: see [SECURITY.md](SECURITY.md).
