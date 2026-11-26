// HymnFlow Consolidated Translations
// Generated from public/i18n/*.json by scripts/combine_translations.py (keep both in sync)

window.HymnFlowTranslations = {
  "en": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "Lower-third controller for OBS HYMN by @gbcowode",
      "status": {
        "live": "LIVE",
        "storage": "localStorage",
        "ready": "Ready ({storage})",
        "hymnUpdated": "Hymn updated",
        "hymnAdded": "Hymn added"
      },
      "errors": {
        "sendFailed": "Error sending to overlay: {error}"
      }
    },
    "hymns": {
      "title": "Hymns",
      "searchPlaceholder": "Search hymns",
      "searchLabel": "Search hymns by title, author, or number",
      "noHymnsFound": "No hymns found",
      "noHymnSelected": "No hymn selected",
      "selectedTitle": "Selected Hymn Title",
      "buttons": {
        "add": "+ Add",
        "edit": "✏️ Edit",
        "remove": "- Remove",
        "import": "Import",
        "export": "Export"
      },
      "labels": {
        "hymnNumber": "Hymn Number",
        "sourceAbbr": "Source Abbreviation",
        "sourceName": "Source Name",
        "title": "Title",
        "author": "Author",
        "verses": "Verses",
        "chorus": "Chorus",
        "versesSeparator": "(separate verses with blank line)",
        "chorusOptional": "(optional)",
        "required": "*",
        "versesCount": "{count} verse(s)"
      },
      "placeholders": {
        "number": "e.g., 123",
        "sourceAbbr": "e.g., CH, PD, HB",
        "sourceName": "e.g., Church Hymnal, Public Domain",
        "title": "Hymn title",
        "author": "Author name",
        "verses": "Verse 1 text\n\nVerse 2 text\n\nVerse 3 text",
        "chorus": "Chorus text"
      },
      "alerts": {
        "noChorus": "No chorus available for this hymn",
        "noHymnSelected": "No hymn selected",
        "noHymnToEdit": "No hymn selected to edit",
        "titleRequired": "Title is required",
        "versesRequired": "At least one verse is required",
        "validationFailed": "Hymn validation failed:\n{errors}",
        "importFailed": "Import failed: {error}"
      },
      "confirmations": {
        "delete": "Delete \"{title}\"?"
      },
      "status": {
        "exported": "Exported {filename}",
        "imported": "Imported {count} hymn(s){skipped}"
      }
    },
    "services": {
      "title": "Services",
      "newButton": "+ New",
      "namePlaceholder": "Service name (e.g., Sunday Morning)",
      "noServicesFound": "No services created",
      "noHymnsInService": "No hymns added yet",
      "hymnsCount": "{count} hymn(s)",
      "buttons": {
        "addHymn": "+ Add Hymn",
        "save": "Save Service",
        "cancel": "Cancel",
        "load": "Load",
        "edit": "Edit",
        "delete": "Del"
      },
      "addButtons": {
        "hymn": "+ Hymn",
        "scripture": "+ Scripture",
        "announce": "+ Announce",
        "divider": "+ Divider"
      },
      "banner": {
        "prevItem": "Previous item in service",
        "nextItem": "Next item in service"
      },
      "alerts": {
        "nameRequired": "Service name is required",
        "atLeastOneHymn": "Add at least one hymn to the service",
        "itemRequired": "Add at least one item to the service",
        "validationFailed": "Service validation failed:\n{errors}"
      },
      "confirmations": {
        "delete": "Delete this service?"
      },
      "status": {
        "validationIssues": "Warning: Service has validation issues",
        "loaded": "Loaded: {name} ({count} item(s))",
        "deleted": "Service deleted",
        "saved": "Service saved",
        "hymnNotFound": "Hymn not found in library",
        "hymnDeleted": "Hymn deleted ({count} service(s) updated)",
        "divider": "▸ {label}"
      },
      "errors": {
        "saveFailed": "Error saving services: {error}"
      },
      "itemForm": {
        "titles": {
          "addScripture": "Add Scripture",
          "editScripture": "Edit Scripture",
          "addAnnounce": "Add Announcement",
          "editAnnounce": "Edit Announcement",
          "addDivider": "Add Divider",
          "editDivider": "Edit Divider"
        },
        "placeholders": {
          "scriptureRef": "Reference (e.g., John 3:16)",
          "scriptureText": "Verse text (e.g., For God so loved the world…)",
          "announceText": "Announcement text (e.g., Join us for fellowship after service)",
          "dividerLabel": "Section label (e.g., Offering, Sermon, Prayer)"
        },
        "buttons": {
          "addScripture": "Add Scripture",
          "addAnnounce": "Add Announcement",
          "addDivider": "Add Divider",
          "save": "Save"
        }
      }
    },
    "textSlide": {
      "title": "Text Slide",
      "hint": "scripture, announcement, blank",
      "sendButton": "Send to Overlay",
      "clearButton": "Clear Slide",
      "sent": "Text slide sent",
      "cleared": "Text slide cleared"
    },
    "bible": {
      "title": "Bible",
      "label": "Bible",
      "description": "Import a Bible JSON file (any translation) to enable verse lookup. Each translation is stored separately — switch between them anytime.",
      "importButton": "Import JSON",
      "loading": "Loading Bible…",
      "notLoaded": "Not loaded"
    },
    "quickScripture": {
      "title": "Quick Scripture",
      "hint": "live · ad-hoc",
      "refPlaceholder": "Reference (e.g., John 3:16)",
      "textPlaceholder": "Verse text — blank line separates pages",
      "lookupButton": "🔍",
      "displayButton": "Display",
      "clearButton": "Clear",
      "status": "Scripture: {ref}",
      "statusNoRef": "Scripture displayed"
    },
    "navigation": {
      "verseInfo": "Verse {current}/{total} · Lines {startLine}-{endLine} of {totalLines}",
      "chorusInfo": "Chorus · Lines {startLine}-{endLine} of {totalLines}",
      "lastVerse": " · Last verse",
      "lastChorus": " · Last chorus",
      "chorusNext": " · Chorus next",
      "shrinksToFit": " · ⚠ shrinks to fit",
      "buttons": {
        "prevVerse": "⟵ Previous",
        "nextVerse": "Next ⟶",
        "prevLine": "⬆ Previous Line",
        "nextLine": "⬇ Next Line",
        "jumpChorus": "Jump to Chorus",
        "emergencyClear": "Emergency Clear"
      },
      "tooltips": {
        "prevVerse": "Previous verse (Left arrow)",
        "nextVerse": "Next verse (Right arrow)",
        "prevLine": "Previous line window (Up arrow)",
        "nextLine": "Next line window (Down arrow)",
        "jumpChorus": "Display chorus if available",
        "emergencyClear": "Immediately hide overlay from stream"
      }
    },
    "display": {
      "title": "Display Controls",
      "hotkeysReconnecting": "OBS hotkeys disconnected — reconnecting…",
      "offHint": "Display is OFF — flip the Display switch to show this hymn",
      "displayLabel": "Display",
      "liveIndicator": "LIVE",
      "resetButton": "Reset",
      "resetTooltip": "Reset to first verse, first line",
      "linesPerDisplay": "Lines per display",
      "noHymnSelected": "Nothing to display — select a hymn first",
      "displayOffHint": "Display is OFF — flip the Display switch to show this hymn",
      "blanked": "Screen blanked — Display or Quick Scripture will bring it back"
    },
    "preview": {
      "title": "Hymn Previews"
    },
    "styles": {
      "title": "Styles",
      "fontFamily": "Font Family",
      "fontSize": "Font size",
      "bold": "Bold",
      "italic": "Italic",
      "shadow": "Shadow",
      "glow": "Glow",
      "outline": "Outline",
      "outlineColor": "Outline Color",
      "outlineWidth": "Outline Width",
      "textColor": "Text Color",
      "bgType": "Background type",
      "bgColorA": "Background color A",
      "bgColorB": "Background color B (for gradient)",
      "animation": "Animation",
      "position": "Position",
      "bgTypes": {
        "transparent": "Transparent",
        "solid": "Solid",
        "gradient": "Gradient"
      },
      "animations": {
        "fade": "Fade",
        "slide": "Slide",
        "none": "None"
      },
      "positions": {
        "bottom": "Bottom Third",
        "middle": "Middle",
        "top": "Top"
      }
    },
    "modal": {
      "editHymn": "Edit Hymn",
      "addHymn": "Add Hymn",
      "buttons": {
        "cancel": "Cancel",
        "save": "Save Changes",
        "delete": "Delete",
        "discard": "Discard",
        "addAnyway": "Add anyway",
        "ok": "OK"
      },
      "confirmations": {
        "discard": "Discard unsaved changes?",
        "badReference": "\"{ref}\" doesn't look like a valid Bible reference.\nAdd it anyway?"
      }
    },
    "settings": {
      "title": "Settings",
      "language": "Language",
      "languageLabel": "Interface Language"
    },
    "tabs": {
      "library": "Library",
      "service": "Service",
      "live": "Live",
      "style": "Style"
    },
    "setup": {
      "import": {
        "selectFile": "Select the downloaded .json, .txt, or .csv file"
      },
      "controls": {
        "exportDesc": "Save hymns to hymnflow-export.json"
      },
      "features": {
        "importFormats": "Import .txt, .csv, or .json files"
      },
      "importFormats": {
        "csv": "CSV Format"
      }
    },
    "ui": {
      "blank_screen": "Blank Screen",
      "restore": "↩ Restore",
      "shortcuts": "? Shortcuts",
      "tip_drop_any_downloaded_file_anywhere": "Tip: drop any downloaded file anywhere on the dock — a Bible (.zip, .json, USFM), hymns, a service schedule or a backup. HymnFlow works out what it is, unzips and converts it for you.",
      "get_another_translation": "Get another translation",
      "hymnflow_never_downloads_anything_itself_pick": "HymnFlow never downloads anything itself. Pick a language, open the link, save the file, then drop it onto the Bible card above — no unzipping or converting needed. Check each translation’s license.",
      "language": "Language",
      "import": "Import",
      "cancel": "Cancel",
      "auto_display_planned_scripture": "Auto-display planned scripture",
      "background_opacity": "Background Opacity",
      "scripture_display": "Scripture Display",
      "scripture_font": "Scripture font",
      "classic_serif_default": "Classic Serif (default)",
      "same_as_lyrics": "Same as lyrics",
      "italic_text": "Italic text",
      "show_reference": "Show reference",
      "translation_badge": "Translation badge",
      "custom_size": "Custom size",
      "scripture_font_size": "Scripture font size",
      "obs_connection": "OBS Connection",
      "host": "Host",
      "port": "Port",
      "password": "Password",
      "connect": "Connect",
      "disconnect": "Disconnect",
      "hotkeys_dock_focus": "Hotkeys (dock focus)",
      "data_backup": "Data & Backup",
      "hymns_services_and_settings_are_stored": "Hymns, services and settings are stored in this browser. A snapshot is taken automatically each time the dock opens, and deleted hymns or services can be undone for a few seconds.",
      "export_backup": "Export backup…",
      "restore_from_file": "Restore from file…",
      "usage_report_each_hymn_put_on": "Usage report: each hymn put on screen is logged on this device (date, title, CCLI number) so you can report to CCLI. Nothing is sent anywhere.",
      "export_usage_report_csv": "Export usage report (CSV)…",
      "clear_usage_log": "Clear usage log",
      "automatic_snapshots": "Automatic snapshots",
      "restore_selected_snapshot": "Restore selected snapshot",
      "bibles_are_stored_separately_and_are": "Bibles are stored separately and are not touched by backup or restore. OBS connection details and password are never written to a backup file.",
      "licensing_credits": "Licensing & credits",
      "livestreaming": "Livestreaming:",
      "showing_copyrighted_lyrics_on_a_livestream": "showing copyrighted lyrics on a livestream usually needs a streaming license in addition to a standard church copyright license (for example CCLI or OneLicense). Requirements differ by country and platform — check with your licensing provider. Public-domain hymns need none. Record each hymn’s copyright and CCLI number in its edit form.",
      "bible_translations": "Bible translations:",
      "you_are_responsible_for_having_the": "you are responsible for having the right to use the translations you import. Public-domain and openly licensed texts are fine; others need permission from the publisher.",
      "ask_for_a_second_press_before": "Ask for a second press before moving to the next service item",
      "copyright": "Copyright",
      "ccli": "CCLI #",
      "name_optional": "Name (optional)",
      "search_by_title_author_or_number": "Search by title, author or number…",
      "reference_or_label": "Reference or label",
      "enter_text": "Enter text…",
      "type_any_text_to_send_to": "Type any text to send to overlay (scripture, announcement, blank screen...)",
      "leave_blank_if_none": "(leave blank if none)",
      "e_g_public_domain_or_1990": "e.g., Public domain, or © 1990 Publisher",
      "take_the_screen_down_without_losing": "Take the screen down without losing your place (B)",
      "bring_back_what_was_on_screen": "Bring back what was on screen before Blank / Clear (Z)",
      "keyboard_shortcuts": "Keyboard shortcuts (?)",
      "previous_item_in_service": "Previous item in service",
      "next_item_in_service": "Next item in service",
      "import_a_service_schedule_from_a": "Import a service schedule from a text file",
      "active_translation": "Active translation",
      "look_up_verse": "Look up verse",
      "skip_the_confidence_preview_planned_scripture": "Skip the confidence preview: planned scripture items go straight to the overlay when activated",
      "on_the_last_verse_the_first": "On the last verse, the first Next only arms the advance; a second press within a few seconds moves to the next service item",
      "storage_type": "Storage type",
      "main_navigation": "Main navigation",
      "keyboard_shortcuts_2": "Keyboard shortcuts",
      "filter_by_source": "Filter by source",
      "hymns_library": "Hymns library",
      "select_hymn_file_to_import": "Select hymn file to import",
      "translation_name_optional_filled_in_automaticall": "Translation name (optional, filled in automatically)",
      "select_a_bible_file": "Select a Bible file",
      "select_service_schedule_text_file": "Select service schedule text file",
      "saved_services": "Saved services",
      "jump_to_verse": "Jump to verse",
      "scripture_reference": "Scripture reference",
      "bible_translation": "Bible translation",
      "verse_text": "Verse text",
      "previous_page": "Previous page",
      "next_page": "Next page",
      "background_opacity_2": "Background opacity"
    },
    "drop": {
      "overlay": "Drop to import",
      "unsupported": "That kind of file can't be imported. Use a hymn file (.txt, .csv, .json, .cho, .usr), a Bible file (.zip, .json, .usfm), a service schedule (.txt) or a HymnFlow backup (.json)."
    },
    "msg": {
      "noSnapshots": "No snapshots yet",
      "shortcutsNote": "Shortcuts work while the dock has focus. For keys that work from any window, connect OBS hotkeys in Style → OBS Connection.",
      "hotkeysOn": "Global hotkeys: on",
      "hotkeysConnecting": "Global hotkeys: connecting…",
      "hotkeysOff": "Global hotkeys: off",
      "hotkeysConnected": "OBS hotkeys connected",
      "storageFullHymns": "Storage full ({count} hymns). Export your hymns then clear storage to continue.",
      "storageFull": "Storage full — export hymns to free space.",
      "errorSavingHymns": "Error saving hymns: {error}",
      "errorSavingSettings": "Error saving settings: {error}",
      "errorSavingServices": "Error saving services: {error}",
      "bibleNotLoaded": "Bible not loaded — import a translation in the Library tab",
      "draftRestored": "Restored unsaved service draft",
      "listLabel": "List label: \"{label}\"",
      "cueNotes": "Cue Notes — {item}",
      "serviceDeletedShort": "Service deleted",
      "duplicated": "Duplicated: \"{name}\"",
      "serviceImportEmpty": "Import failed: no service items found in file",
      "serviceImported": "Imported \"{name}\" — {count} item(s){warnings}",
      "warningsCount": "{count} warning(s)",
      "serviceImportWarnings": "Service imported with warnings:",
      "couldNotRead": "Could not read file",
      "importing": "Importing… ({done}/{total})",
      "importFailed": "Import failed: {error}",
      "kjvLoaded": "KJV loaded — ready for scripture lookup",
      "noUsage": "No hymns have been displayed yet.",
      "clearUsageConfirm": "Clear the usage log on this device? Export it first if you need it for reporting.",
      "clear": "Clear",
      "usageCleared": "Usage log cleared",
      "creditsIntro": "Credits for the translations you have loaded (list these in your church credits):",
      "open": "Open",
      "copyLink": "Copy link",
      "linkCopied": "Link copied",
      "copyManually": "Select the link text above and copy it (Ctrl+C)",
      "hotkeysSetupTitle": "Click to set up global hotkeys (Style → OBS Connection)"
    },
    "bibleGet": {
      "otherLanguages": "Other languages",
      "license": {
        "pd": "Public domain",
        "bibliatodo": "Free license (BibliaTodo v1.9) — credit required",
        "ccbysa": "CC BY-SA 4.0 — credit Biblica",
        "varies": "Varies — check each translation"
      },
      "steps": {
        "save": "Save the file, then drop it onto the Bible card above.",
        "zip": "Download the JSON ZIP and drop it onto the Bible card above (no unzipping needed).",
        "ntbt": "Drop the downloaded ZIP onto the Bible card above (no unzipping needed).",
        "yoruba": "On the page, download the USFM (.zip) version and drop it onto the Bible card above — HymnFlow converts it for you.",
        "ebible": "Hundreds of translations. Download the USFM (.zip) version and drop it onto the Bible card above."
      }
    },
    "operator": {
      "corruptKept": "Saved {name} data could not be read. A copy was kept in browser storage (hymnflow-corrupt-{name}-*) so it can be recovered.",
      "restore": "Restore",
      "noSnapshot": "That snapshot is no longer available.",
      "notBackup": "That file is not a HymnFlow backup.",
      "emptyBackup": "The backup contains no usable hymns.",
      "undo": "Undo",
      "undone": "Restored",
      "nothingToRestore": "Nothing to restore",
      "restored": "Restored what was on screen",
      "pressAgain": "Last verse — press Next again for {item}",
      "blanked": "Screen blanked",
      "cleared": "Screen cleared",
      "hymnDeleted": "Deleted \"{title}\"",
      "serviceDeleted": "Deleted service \"{name}\""
    }
  },
  "es": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "Controlador de tercio inferior para OBS HYMN by @gbcowode",
      "status": {
        "live": "EN VIVO",
        "ready": "Listo ({storage})",
        "hymnUpdated": "Himno actualizado",
        "hymnAdded": "Himno añadido",
        "storage": "localStorage"
      },
      "errors": {
        "sendFailed": "Error al enviar a la superposición: {error}"
      }
    },
    "hymns": {
      "title": "Himnos",
      "searchPlaceholder": "Buscar himnos",
      "searchLabel": "Buscar himnos por título, autor o número",
      "noHymnsFound": "No se encontraron himnos",
      "noHymnSelected": "Ningún himno seleccionado",
      "selectedTitle": "Título del himno seleccionado",
      "buttons": {
        "add": "+ Agregar",
        "edit": "✏️ Editar",
        "remove": "- Eliminar",
        "import": "Importar",
        "export": "Exportar"
      },
      "labels": {
        "hymnNumber": "Número del himno",
        "sourceAbbr": "Abreviatura de la fuente",
        "sourceName": "Nombre de la fuente",
        "title": "Título",
        "author": "Autor",
        "verses": "Versos",
        "chorus": "Coro",
        "versesSeparator": "(separar versos con línea en blanco)",
        "chorusOptional": "(opcional)",
        "required": "*",
        "versesCount": "{count} verso(s)"
      },
      "placeholders": {
        "number": "ej., 123",
        "sourceAbbr": "ej., HC, DP, HB",
        "sourceName": "ej., Himnario Cristiano, Dominio Público",
        "title": "Título del himno",
        "author": "Nombre del autor",
        "verses": "Texto del verso 1\n\nTexto del verso 2\n\nTexto del verso 3",
        "chorus": "Texto del coro"
      },
      "alerts": {
        "noChorus": "No hay coro disponible para este himno",
        "noHymnSelected": "Ningún himno seleccionado",
        "noHymnToEdit": "Ningún himno seleccionado para editar",
        "titleRequired": "El título es obligatorio",
        "versesRequired": "Se requiere al menos un verso",
        "validationFailed": "Error de validación del himno:\n{errors}",
        "importFailed": "Error al importar: {error}"
      },
      "confirmations": {
        "delete": "¿Eliminar \"{title}\"?"
      },
      "status": {
        "exported": "Exportado {filename}",
        "imported": "Importado {count} himno(s){skipped}"
      }
    },
    "services": {
      "title": "Servicios",
      "newButton": "+ Nuevo",
      "namePlaceholder": "Nombre del servicio (ej., Domingo por la mañana)",
      "noServicesFound": "No se crearon servicios",
      "noHymnsInService": "Aún no se han añadido himnos",
      "hymnsCount": "{count} himno(s)",
      "buttons": {
        "addHymn": "+ Agregar himno",
        "save": "Guardar servicio",
        "cancel": "Cancelar",
        "load": "Cargar",
        "edit": "Editar",
        "delete": "Eliminar"
      },
      "alerts": {
        "nameRequired": "El nombre del servicio es obligatorio",
        "atLeastOneHymn": "Agregue al menos un himno al servicio",
        "validationFailed": "Error de validación del servicio:\n{errors}",
        "itemRequired": "Añade al menos un elemento al servicio"
      },
      "confirmations": {
        "delete": "¿Eliminar este servicio?"
      },
      "status": {
        "validationIssues": "Advertencia: El servicio tiene problemas de validación",
        "loaded": "Servicio cargado: {name} ({count} himnos)",
        "deleted": "Servicio eliminado",
        "saved": "Servicio guardado",
        "hymnNotFound": "Himno no encontrado en la biblioteca",
        "divider": "▸ {label}",
        "hymnDeleted": "Himno eliminado ({count} servicio(s) actualizado(s))"
      },
      "errors": {
        "saveFailed": "Error al guardar los servicios: {error}"
      },
      "addButtons": {
        "announce": "+ Anuncio",
        "divider": "+ Divisor",
        "hymn": "+ Himno",
        "scripture": "+ Escritura"
      },
      "banner": {
        "nextItem": "Siguiente elemento del servicio",
        "prevItem": "Elemento anterior del servicio"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "Añadir anuncio",
          "addDivider": "Añadir divisor",
          "addScripture": "Añadir Escritura",
          "save": "Guardar"
        },
        "placeholders": {
          "announceText": "Texto del anuncio (p. ej., Acompáñanos en la comunión después del servicio)",
          "dividerLabel": "Etiqueta de sección (p. ej., Ofrenda, Sermón, Oración)",
          "scriptureRef": "Referencia (p. ej., Juan 3:16)",
          "scriptureText": "Texto del versículo (p. ej., Porque de tal manera amó Dios al mundo…)"
        },
        "titles": {
          "addAnnounce": "Añadir anuncio",
          "addDivider": "Añadir divisor",
          "addScripture": "Añadir Escritura",
          "editAnnounce": "Editar anuncio",
          "editDivider": "Editar divisor",
          "editScripture": "Editar Escritura"
        }
      }
    },
    "textSlide": {
      "title": "Diapositiva de Texto",
      "hint": "escritura, anuncio, pantalla en blanco",
      "sendButton": "Enviar a Overlay",
      "clearButton": "Borrar Diapositiva",
      "sent": "Diapositiva de texto enviada",
      "cleared": "Diapositiva de texto borrada"
    },
    "bible": {
      "title": "Biblia",
      "label": "Biblia",
      "description": "Importa un archivo JSON de cualquier traducción para habilitar la búsqueda de versículos. Cada traducción se guarda por separado — cambia entre ellas en cualquier momento.",
      "importButton": "Importar JSON",
      "loading": "Cargando Biblia…",
      "notLoaded": "No cargada"
    },
    "quickScripture": {
      "title": "Escritura Rápida",
      "hint": "en vivo · ad-hoc",
      "refPlaceholder": "Referencia (ej., Juan 3:16)",
      "textPlaceholder": "Texto del versículo — línea en blanco separa páginas",
      "lookupButton": "🔍",
      "displayButton": "Mostrar",
      "clearButton": "Borrar",
      "status": "Escritura: {ref}",
      "statusNoRef": "Escritura mostrada"
    },
    "navigation": {
      "verseInfo": "Verso {current}/{total} · Líneas {startLine}-{endLine} de {totalLines}",
      "buttons": {
        "prevVerse": "⟵ Anterior",
        "nextVerse": "Siguiente ⟶",
        "prevLine": "⬆ Línea anterior",
        "nextLine": "⬇ Siguiente línea",
        "jumpChorus": "Ir al coro",
        "emergencyClear": "Borrado de emergencia"
      },
      "tooltips": {
        "prevVerse": "Verso anterior (Flecha izquierda)",
        "nextVerse": "Siguiente verso (Flecha derecha)",
        "prevLine": "Ventana de línea anterior (Flecha arriba)",
        "nextLine": "Ventana de siguiente línea (Flecha abajo)",
        "jumpChorus": "Mostrar coro si está disponible",
        "emergencyClear": "Ocultar inmediatamente la superposición de la transmisión"
      },
      "chorusNext": " · Sigue el coro",
      "lastChorus": " · Último coro",
      "lastVerse": " · Último versículo",
      "shrinksToFit": " · ⚠ se reduce para ajustarse",
      "chorusInfo": "Coro · Líneas {startLine}-{endLine} de {totalLines}"
    },
    "display": {
      "title": "Controles de visualización",
      "displayLabel": "Visualización",
      "liveIndicator": "EN VIVO",
      "resetButton": "Restablecer",
      "resetTooltip": "Restablecer al primer verso, primera línea",
      "linesPerDisplay": "Líneas por visualización",
      "blanked": "Pantalla en blanco: Mostrar o Escritura rápida la recuperarán",
      "displayOffHint": "La pantalla está APAGADA: activa el interruptor Mostrar para ver este himno",
      "hotkeysReconnecting": "Atajos de OBS desconectados: reconectando…",
      "noHymnSelected": "Nada que mostrar: selecciona primero un himno",
      "offHint": "La pantalla está APAGADA: activa el interruptor Mostrar para ver este himno"
    },
    "preview": {
      "title": "Vista previa de himnos"
    },
    "styles": {
      "title": "Estilos",
      "fontFamily": "Familia de fuente",
      "fontSize": "Tamaño de fuente",
      "bold": "Negrita",
      "italic": "Cursiva",
      "shadow": "Sombra",
      "glow": "Resplandor",
      "outline": "Contorno",
      "outlineColor": "Color del contorno",
      "outlineWidth": "Ancho del contorno",
      "textColor": "Color del texto",
      "bgType": "Tipo de fondo",
      "bgColorA": "Color de fondo A",
      "bgColorB": "Color de fondo B (para gradiente)",
      "animation": "Animación",
      "position": "Posición",
      "bgTypes": {
        "transparent": "Transparente",
        "solid": "Sólido",
        "gradient": "Gradiente"
      },
      "animations": {
        "fade": "Desvanecer",
        "slide": "Deslizar",
        "none": "Ninguno"
      },
      "positions": {
        "bottom": "Tercio inferior",
        "middle": "Medio",
        "top": "Superior"
      }
    },
    "modal": {
      "editHymn": "Editar himno",
      "addHymn": "Agregar himno",
      "buttons": {
        "cancel": "Cancelar",
        "save": "Guardar cambios",
        "addAnyway": "Añadir de todos modos",
        "delete": "Eliminar",
        "discard": "Descartar",
        "ok": "Aceptar"
      },
      "confirmations": {
        "badReference": "\"{ref}\" no parece una referencia bíblica válida.\n¿Añadirla de todos modos?",
        "discard": "¿Descartar los cambios sin guardar?"
      }
    },
    "settings": {
      "title": "Configuración",
      "language": "Idioma",
      "languageLabel": "Idioma de la interfaz"
    },
    "tabs": {
      "library": "Biblioteca",
      "service": "Servicio",
      "live": "En Vivo",
      "style": "Estilo"
    },
    "setup": {
      "import": {
        "selectFile": "Seleccione el archivo descargado .json, .txt o .csv"
      },
      "controls": {
        "exportDesc": "Guarde los himnos en hymnflow-export.json"
      },
      "features": {
        "importFormats": "Importe archivos .txt, .csv o .json"
      },
      "importFormats": {
        "csv": "Formato CSV"
      }
    },
    "ui": {
      "blank_screen": "Pantalla en blanco",
      "restore": "↩ Restaurar",
      "shortcuts": "? Atajos",
      "tip_drop_any_downloaded_file_anywhere": "Consejo: suelta cualquier archivo descargado en cualquier parte del panel: una Biblia (.zip, .json, USFM), himnos, un programa de servicio o una copia de seguridad. HymnFlow detecta qué es, lo descomprime y lo convierte por ti.",
      "get_another_translation": "Obtener otra traducción",
      "hymnflow_never_downloads_anything_itself_pick": "HymnFlow nunca descarga nada por sí mismo. Elige un idioma, abre el enlace, guarda el archivo y suéltalo sobre la tarjeta de la Biblia de arriba; no hace falta descomprimir ni convertir. Revisa la licencia de cada traducción.",
      "language": "Idioma",
      "import": "Importar",
      "cancel": "Cancelar",
      "auto_display_planned_scripture": "Mostrar automáticamente la Escritura planificada",
      "background_opacity": "Opacidad del fondo",
      "scripture_display": "Visualización de la Escritura",
      "scripture_font": "Fuente de la Escritura",
      "classic_serif_default": "Serif clásica (predeterminada)",
      "same_as_lyrics": "Igual que la letra",
      "italic_text": "Texto en cursiva",
      "show_reference": "Mostrar referencia",
      "translation_badge": "Insignia de traducción",
      "custom_size": "Tamaño personalizado",
      "scripture_font_size": "Tamaño de la fuente de la Escritura",
      "obs_connection": "Conexión con OBS",
      "host": "Servidor",
      "port": "Puerto",
      "password": "Contraseña",
      "connect": "Conectar",
      "disconnect": "Desconectar",
      "hotkeys_dock_focus": "Atajos (con el panel activo)",
      "data_backup": "Datos y copia de seguridad",
      "hymns_services_and_settings_are_stored": "Los himnos, servicios y ajustes se guardan en este navegador. Se toma una copia automática cada vez que se abre el panel y puedes deshacer el borrado de un himno o servicio durante unos segundos.",
      "export_backup": "Exportar copia de seguridad…",
      "restore_from_file": "Restaurar desde archivo…",
      "usage_report_each_hymn_put_on": "Informe de uso: cada himno que se muestra en pantalla se registra en este dispositivo (fecha, título, número CCLI) para que puedas informar a CCLI. No se envía nada a ninguna parte.",
      "export_usage_report_csv": "Exportar informe de uso (CSV)…",
      "clear_usage_log": "Borrar registro de uso",
      "automatic_snapshots": "Copias automáticas",
      "restore_selected_snapshot": "Restaurar la copia seleccionada",
      "bibles_are_stored_separately_and_are": "Las Biblias se guardan por separado y la copia de seguridad o la restauración no las modifica. Los datos de conexión de OBS y la contraseña nunca se escriben en un archivo de copia.",
      "licensing_credits": "Licencias y créditos",
      "livestreaming": "Transmisión en vivo:",
      "showing_copyrighted_lyrics_on_a_livestream": "mostrar letras con derechos de autor en una transmisión en vivo suele requerir una licencia de transmisión además de la licencia de derechos de autor de iglesia (por ejemplo CCLI u OneLicense). Los requisitos varían según el país y la plataforma: consulta con tu proveedor de licencias. Los himnos de dominio público no la necesitan. Registra los derechos de autor y el número CCLI de cada himno en su formulario de edición.",
      "bible_translations": "Traducciones de la Biblia:",
      "you_are_responsible_for_having_the": "eres responsable de tener derecho a usar las traducciones que importes. Los textos de dominio público o con licencia abierta no tienen problema; los demás requieren permiso del editor.",
      "ask_for_a_second_press_before": "Pedir una segunda pulsación antes de pasar al siguiente elemento del servicio",
      "copyright": "Derechos de autor",
      "ccli": "Nº CCLI",
      "name_optional": "Nombre (opcional)",
      "search_by_title_author_or_number": "Buscar por título, autor o número…",
      "reference_or_label": "Referencia o etiqueta",
      "enter_text": "Escribe el texto…",
      "type_any_text_to_send_to": "Escribe cualquier texto para enviarlo a la pantalla (Escritura, anuncio, pantalla en blanco...)",
      "leave_blank_if_none": "(déjalo en blanco si no hay)",
      "e_g_public_domain_or_1990": "p. ej., Dominio público, o © 1990 Editorial",
      "take_the_screen_down_without_losing": "Quita la pantalla sin perder tu lugar (B)",
      "bring_back_what_was_on_screen": "Recupera lo que estaba en pantalla antes de Blanco / Borrar (Z)",
      "keyboard_shortcuts": "Atajos de teclado (?)",
      "previous_item_in_service": "Elemento anterior del servicio",
      "next_item_in_service": "Siguiente elemento del servicio",
      "import_a_service_schedule_from_a": "Importar un programa de servicio desde un archivo de texto",
      "active_translation": "Traducción activa",
      "look_up_verse": "Buscar versículo",
      "skip_the_confidence_preview_planned_scripture": "Omitir la vista previa de confianza: los pasajes planificados van directamente a la pantalla al activarse",
      "on_the_last_verse_the_first": "En el último versículo, la primera pulsación de Siguiente solo prepara el avance; una segunda pulsación en pocos segundos pasa al siguiente elemento del servicio",
      "storage_type": "Tipo de almacenamiento",
      "main_navigation": "Navegación principal",
      "keyboard_shortcuts_2": "Atajos de teclado",
      "filter_by_source": "Filtrar por fuente",
      "hymns_library": "Biblioteca de himnos",
      "select_hymn_file_to_import": "Seleccionar archivo de himnos para importar",
      "translation_name_optional_filled_in_automaticall": "Nombre de la traducción (opcional, se completa automáticamente)",
      "select_a_bible_file": "Seleccionar un archivo de la Biblia",
      "select_service_schedule_text_file": "Seleccionar archivo de texto del programa de servicio",
      "saved_services": "Servicios guardados",
      "jump_to_verse": "Ir al versículo",
      "scripture_reference": "Referencia bíblica",
      "bible_translation": "Traducción de la Biblia",
      "verse_text": "Texto del versículo",
      "previous_page": "Página anterior",
      "next_page": "Página siguiente",
      "background_opacity_2": "Opacidad del fondo"
    },
    "drop": {
      "overlay": "Suelta para importar",
      "unsupported": "Ese tipo de archivo no se puede importar. Usa un archivo de himnos (.txt, .csv, .json, .cho, .usr), de Biblia (.zip, .json, .usfm), un programa de servicio (.txt) o una copia de HymnFlow (.json)."
    },
    "msg": {
      "noSnapshots": "Aún no hay copias",
      "shortcutsNote": "Los atajos funcionan mientras el panel tiene el foco. Para atajos que funcionen desde cualquier ventana, conecta los atajos de OBS en Estilo → Conexión con OBS.",
      "hotkeysOn": "Atajos globales: activados",
      "hotkeysConnecting": "Atajos globales: conectando…",
      "hotkeysOff": "Atajos globales: desactivados",
      "hotkeysConnected": "Atajos de OBS conectados",
      "storageFullHymns": "Almacenamiento lleno ({count} himnos). Exporta tus himnos y luego libera espacio para continuar.",
      "storageFull": "Almacenamiento lleno: exporta himnos para liberar espacio.",
      "errorSavingHymns": "Error al guardar los himnos: {error}",
      "errorSavingSettings": "Error al guardar los ajustes: {error}",
      "errorSavingServices": "Error al guardar los servicios: {error}",
      "bibleNotLoaded": "Biblia no cargada: importa una traducción en la pestaña Biblioteca",
      "draftRestored": "Se recuperó el borrador del servicio sin guardar",
      "listLabel": "Etiqueta de lista: \"{label}\"",
      "cueNotes": "Notas de entrada — {item}",
      "serviceDeletedShort": "Servicio eliminado",
      "duplicated": "Duplicado: \"{name}\"",
      "serviceImportEmpty": "Error al importar: no se encontraron elementos del servicio en el archivo",
      "serviceImported": "Importado \"{name}\": {count} elemento(s){warnings}",
      "warningsCount": "{count} advertencia(s)",
      "serviceImportWarnings": "Servicio importado con advertencias:",
      "couldNotRead": "No se pudo leer el archivo",
      "importing": "Importando… ({done}/{total})",
      "importFailed": "Error al importar: {error}",
      "kjvLoaded": "KJV cargada: lista para buscar versículos",
      "noUsage": "Aún no se ha mostrado ningún himno.",
      "clearUsageConfirm": "¿Borrar el registro de uso de este dispositivo? Expórtalo antes si lo necesitas para informar.",
      "clear": "Borrar",
      "usageCleared": "Registro de uso borrado",
      "creditsIntro": "Créditos de las traducciones cargadas (inclúyelos en los créditos de tu iglesia):",
      "open": "Abrir",
      "copyLink": "Copiar enlace",
      "linkCopied": "Enlace copiado",
      "copyManually": "Selecciona el texto del enlace de arriba y cópialo (Ctrl+C)",
      "hotkeysSetupTitle": "Haz clic para configurar los atajos globales (Estilo → Conexión con OBS)"
    },
    "bibleGet": {
      "otherLanguages": "Otros idiomas",
      "license": {
        "pd": "Dominio público",
        "bibliatodo": "Licencia gratuita (BibliaTodo v1.9): se requiere crédito",
        "ccbysa": "CC BY-SA 4.0: dar crédito a Biblica",
        "varies": "Varía: revisa cada traducción"
      },
      "steps": {
        "save": "Guarda el archivo y suéltalo sobre la tarjeta de la Biblia de arriba.",
        "zip": "Descarga el ZIP JSON y suéltalo sobre la tarjeta de la Biblia de arriba (no hace falta descomprimir).",
        "ntbt": "Suelta el ZIP descargado sobre la tarjeta de la Biblia de arriba (no hace falta descomprimir).",
        "yoruba": "En la página, descarga la versión USFM (.zip) y suéltala sobre la tarjeta de la Biblia de arriba: HymnFlow la convierte por ti.",
        "ebible": "Cientos de traducciones. Descarga la versión USFM (.zip) y suéltala sobre la tarjeta de la Biblia de arriba."
      }
    },
    "operator": {
      "corruptKept": "No se pudieron leer los datos guardados de {name}. Se conservó una copia en el almacenamiento del navegador (hymnflow-corrupt-{name}-*) para poder recuperarla.",
      "restore": "Restaurar",
      "noSnapshot": "Esa copia ya no está disponible.",
      "notBackup": "Ese archivo no es una copia de HymnFlow.",
      "emptyBackup": "La copia no contiene himnos utilizables.",
      "undo": "Deshacer",
      "undone": "Restaurado",
      "nothingToRestore": "Nada que restaurar",
      "restored": "Se restauró lo que había en pantalla",
      "pressAgain": "Último versículo: pulsa Siguiente otra vez para {item}",
      "blanked": "Pantalla en blanco",
      "cleared": "Pantalla borrada",
      "hymnDeleted": "Eliminado \"{title}\"",
      "serviceDeleted": "Servicio eliminado \"{name}\""
    }
  },
  "fr": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "Contrôleur de tiers inférieur pour OBS HYMN by @gbcowode",
      "status": {
        "live": "EN DIRECT",
        "ready": "Prêt ({storage})",
        "hymnUpdated": "Cantique mis à jour",
        "hymnAdded": "Cantique ajouté",
        "storage": "localStorage"
      },
      "errors": {
        "sendFailed": "Erreur d'envoi vers l'incrustation : {error}"
      }
    },
    "hymns": {
      "title": "Cantiques",
      "searchPlaceholder": "Rechercher des cantiques",
      "searchLabel": "Rechercher des cantiques par titre, auteur ou numéro",
      "noHymnsFound": "Aucun cantique trouvé",
      "noHymnSelected": "Aucun cantique sélectionné",
      "selectedTitle": "Titre du cantique sélectionné",
      "buttons": {
        "add": "+ Ajouter",
        "edit": "✏️ Modifier",
        "remove": "- Supprimer",
        "import": "Importer",
        "export": "Exporter"
      },
      "labels": {
        "hymnNumber": "Numéro du cantique",
        "sourceAbbr": "Abréviation de la source",
        "sourceName": "Nom de la source",
        "title": "Titre",
        "author": "Auteur",
        "verses": "Versets",
        "chorus": "Refrain",
        "versesSeparator": "(séparer les versets par une ligne vide)",
        "chorusOptional": "(optionnel)",
        "required": "*",
        "versesCount": "{count} verset(s)"
      },
      "placeholders": {
        "number": "ex., 123",
        "sourceAbbr": "ex., CH, PD, HB",
        "sourceName": "ex., Recueil d'hymnes, Domaine public",
        "title": "Titre du cantique",
        "author": "Nom de l'auteur",
        "verses": "Texte du verset 1\n\nTexte du verset 2\n\nTexte du verset 3",
        "chorus": "Texte du refrain"
      },
      "alerts": {
        "noChorus": "Aucun refrain disponible pour ce cantique",
        "noHymnSelected": "Aucun cantique sélectionné",
        "noHymnToEdit": "Aucun cantique sélectionné à modifier",
        "titleRequired": "Le titre est obligatoire",
        "versesRequired": "Au moins un verset est requis",
        "validationFailed": "Échec de la validation du cantique :\n{errors}",
        "importFailed": "Échec de l'importation : {error}"
      },
      "confirmations": {
        "delete": "Supprimer \"{title}\" ?"
      },
      "status": {
        "exported": "Exporté vers {filename}",
        "imported": "Importé {count} cantique(s){skipped}"
      }
    },
    "services": {
      "title": "Services",
      "newButton": "+ Nouveau",
      "namePlaceholder": "Nom du service (ex., Dimanche matin)",
      "noServicesFound": "Aucun service créé",
      "noHymnsInService": "Aucun cantique ajouté pour l'instant",
      "hymnsCount": "{count} cantique(s)",
      "buttons": {
        "addHymn": "+ Ajouter un cantique",
        "save": "Enregistrer le service",
        "cancel": "Annuler",
        "load": "Charger",
        "edit": "Modifier",
        "delete": "Suppr"
      },
      "alerts": {
        "nameRequired": "Le nom du service est obligatoire",
        "atLeastOneHymn": "Ajoutez au moins un cantique au service",
        "validationFailed": "Échec de la validation du service :\n{errors}",
        "itemRequired": "Ajoutez au moins un élément au programme"
      },
      "confirmations": {
        "delete": "Supprimer ce service ?"
      },
      "status": {
        "validationIssues": "Attention : Le service présente des problèmes de validation",
        "loaded": "Service chargé : {name} ({count} cantiques)",
        "deleted": "Service supprimé",
        "saved": "Service enregistré",
        "hymnNotFound": "Cantique introuvable dans la bibliothèque",
        "divider": "▸ {label}",
        "hymnDeleted": "Cantique supprimé ({count} programme(s) mis à jour)"
      },
      "errors": {
        "saveFailed": "Erreur lors de l'enregistrement des services : {error}"
      },
      "addButtons": {
        "announce": "+ Annonce",
        "divider": "+ Séparateur",
        "hymn": "+ Cantique",
        "scripture": "+ Écriture"
      },
      "banner": {
        "nextItem": "Élément suivant du programme",
        "prevItem": "Élément précédent du programme"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "Ajouter l’annonce",
          "addDivider": "Ajouter le séparateur",
          "addScripture": "Ajouter l’Écriture",
          "save": "Enregistrer"
        },
        "placeholders": {
          "announceText": "Texte de l’annonce (p. ex. Rejoignez-nous pour la communion fraternelle après le culte)",
          "dividerLabel": "Libellé de section (p. ex. Offrande, Prédication, Prière)",
          "scriptureRef": "Référence (p. ex. Jean 3:16)",
          "scriptureText": "Texte du verset (p. ex. Car Dieu a tant aimé le monde…)"
        },
        "titles": {
          "addAnnounce": "Ajouter une annonce",
          "addDivider": "Ajouter un séparateur",
          "addScripture": "Ajouter une Écriture",
          "editAnnounce": "Modifier l’annonce",
          "editDivider": "Modifier le séparateur",
          "editScripture": "Modifier l’Écriture"
        }
      }
    },
    "textSlide": {
      "title": "Diapositive Texte",
      "hint": "écriture, annonce, écran vide",
      "sendButton": "Envoyer à l'Overlay",
      "clearButton": "Effacer la Diapositive",
      "sent": "Diapositive texte envoyée",
      "cleared": "Diapositive texte effacée"
    },
    "bible": {
      "title": "Bible",
      "label": "Bible",
      "description": "Importez un fichier JSON de n'importe quelle traduction pour activer la recherche de versets. Chaque traduction est stockée séparément — changez à tout moment.",
      "importButton": "Importer JSON",
      "loading": "Chargement de la Bible…",
      "notLoaded": "Non chargée"
    },
    "quickScripture": {
      "title": "Scripture Express",
      "hint": "en direct · ad-hoc",
      "refPlaceholder": "Référence (ex., Jean 3:16)",
      "textPlaceholder": "Texte du verset — ligne vide sépare les pages",
      "lookupButton": "🔍",
      "displayButton": "Afficher",
      "clearButton": "Effacer",
      "status": "Écriture : {ref}",
      "statusNoRef": "Écriture affichée"
    },
    "navigation": {
      "verseInfo": "Verset {current}/{total} · Lignes {startLine}-{endLine} sur {totalLines}",
      "buttons": {
        "prevVerse": "⟵ Précédent",
        "nextVerse": "Suivant ⟶",
        "prevLine": "⬆ Ligne précédente",
        "nextLine": "⬇ Ligne suivante",
        "jumpChorus": "Aller au refrain",
        "emergencyClear": "Effacement d'urgence"
      },
      "tooltips": {
        "prevVerse": "Verset précédent (Flèche gauche)",
        "nextVerse": "Verset suivant (Flèche droite)",
        "prevLine": "Fenêtre de ligne précédente (Flèche haut)",
        "nextLine": "Fenêtre de ligne suivante (Flèche bas)",
        "jumpChorus": "Afficher le refrain si disponible",
        "emergencyClear": "Masquer immédiatement la superposition du flux"
      },
      "chorusNext": " · Refrain ensuite",
      "lastChorus": " · Dernier refrain",
      "lastVerse": " · Dernier verset",
      "shrinksToFit": " · ⚠ réduit pour tenir",
      "chorusInfo": "Refrain · Lignes {startLine}-{endLine} sur {totalLines}"
    },
    "display": {
      "title": "Contrôles d'affichage",
      "displayLabel": "Affichage",
      "liveIndicator": "EN DIRECT",
      "resetButton": "Réinitialiser",
      "resetTooltip": "Réinitialiser au premier verset, première ligne",
      "linesPerDisplay": "Lignes par affichage",
      "blanked": "Écran noirci — Afficher ou Écriture rapide le rétablira",
      "displayOffHint": "L’affichage est DÉSACTIVÉ — activez l’interrupteur Afficher pour montrer ce cantique",
      "hotkeysReconnecting": "Raccourcis OBS déconnectés — reconnexion…",
      "noHymnSelected": "Rien à afficher — sélectionnez d’abord un cantique",
      "offHint": "L’affichage est DÉSACTIVÉ — activez l’interrupteur Afficher pour montrer ce cantique"
    },
    "preview": {
      "title": "Aperçu des cantiques"
    },
    "styles": {
      "title": "Styles",
      "fontFamily": "Police de caractères",
      "fontSize": "Taille de police",
      "bold": "Gras",
      "italic": "Italique",
      "shadow": "Ombre",
      "glow": "Lueur",
      "outline": "Contour",
      "outlineColor": "Couleur du contour",
      "outlineWidth": "Largeur du contour",
      "textColor": "Couleur du texte",
      "bgType": "Type d'arrière-plan",
      "bgColorA": "Couleur d'arrière-plan A",
      "bgColorB": "Couleur d'arrière-plan B (pour dégradé)",
      "animation": "Animation",
      "position": "Position",
      "bgTypes": {
        "transparent": "Transparent",
        "solid": "Solide",
        "gradient": "Dégradé"
      },
      "animations": {
        "fade": "Fondu",
        "slide": "Glissement",
        "none": "Aucun"
      },
      "positions": {
        "bottom": "Tiers inférieur",
        "middle": "Milieu",
        "top": "Haut"
      }
    },
    "modal": {
      "editHymn": "Modifier le cantique",
      "addHymn": "Ajouter un cantique",
      "buttons": {
        "cancel": "Annuler",
        "save": "Enregistrer les modifications",
        "addAnyway": "Ajouter quand même",
        "delete": "Supprimer",
        "discard": "Abandonner",
        "ok": "OK"
      },
      "confirmations": {
        "badReference": "« {ref} » ne ressemble pas à une référence biblique valide.\nL’ajouter quand même ?",
        "discard": "Abandonner les modifications non enregistrées ?"
      }
    },
    "settings": {
      "title": "Paramètres",
      "language": "Langue",
      "languageLabel": "Langue de l'interface"
    },
    "tabs": {
      "library": "Bibliothèque",
      "service": "Service",
      "live": "En Direct",
      "style": "Style"
    },
    "setup": {
      "import": {
        "selectFile": "Sélectionnez le fichier téléchargé .json, .txt ou .csv"
      },
      "controls": {
        "exportDesc": "Enregistrez les cantiques dans hymnflow-export.json"
      },
      "features": {
        "importFormats": "Importer des fichiers .txt, .csv ou .json"
      },
      "importFormats": {
        "csv": "Format CSV"
      }
    },
    "ui": {
      "blank_screen": "Écran noir",
      "restore": "↩ Rétablir",
      "shortcuts": "? Raccourcis",
      "tip_drop_any_downloaded_file_anywhere": "Astuce : déposez n’importe quel fichier téléchargé n’importe où dans le dock : une Bible (.zip, .json, USFM), des cantiques, un programme de culte ou une sauvegarde. HymnFlow reconnaît le type, le décompresse et le convertit pour vous.",
      "get_another_translation": "Obtenir une autre traduction",
      "hymnflow_never_downloads_anything_itself_pick": "HymnFlow ne télécharge jamais rien lui-même. Choisissez une langue, ouvrez le lien, enregistrez le fichier, puis déposez-le sur la carte Bible ci-dessus — pas besoin de décompresser ni de convertir. Vérifiez la licence de chaque traduction.",
      "language": "Langue",
      "import": "Importer",
      "cancel": "Annuler",
      "auto_display_planned_scripture": "Afficher automatiquement le passage prévu",
      "background_opacity": "Opacité de l’arrière-plan",
      "scripture_display": "Affichage des Écritures",
      "scripture_font": "Police des Écritures",
      "classic_serif_default": "Serif classique (par défaut)",
      "same_as_lyrics": "Comme les paroles",
      "italic_text": "Texte en italique",
      "show_reference": "Afficher la référence",
      "translation_badge": "Badge de traduction",
      "custom_size": "Taille personnalisée",
      "scripture_font_size": "Taille de la police des Écritures",
      "obs_connection": "Connexion à OBS",
      "host": "Hôte",
      "port": "Port",
      "password": "Mot de passe",
      "connect": "Connecter",
      "disconnect": "Déconnecter",
      "hotkeys_dock_focus": "Raccourcis (dock actif)",
      "data_backup": "Données et sauvegarde",
      "hymns_services_and_settings_are_stored": "Les cantiques, programmes et réglages sont enregistrés dans ce navigateur. Un instantané est pris à chaque ouverture du dock, et la suppression d’un cantique ou d’un programme peut être annulée pendant quelques secondes.",
      "export_backup": "Exporter la sauvegarde…",
      "restore_from_file": "Restaurer depuis un fichier…",
      "usage_report_each_hymn_put_on": "Rapport d’utilisation : chaque cantique affiché à l’écran est enregistré sur cet appareil (date, titre, numéro CCLI) pour vous permettre de déclarer à CCLI. Rien n’est envoyé ailleurs.",
      "export_usage_report_csv": "Exporter le rapport d’utilisation (CSV)…",
      "clear_usage_log": "Effacer le journal d’utilisation",
      "automatic_snapshots": "Instantanés automatiques",
      "restore_selected_snapshot": "Restaurer l’instantané sélectionné",
      "bibles_are_stored_separately_and_are": "Les Bibles sont stockées séparément et ne sont pas touchées par la sauvegarde ni la restauration. Les informations de connexion OBS et le mot de passe ne sont jamais écrits dans une sauvegarde.",
      "licensing_credits": "Licences et crédits",
      "livestreaming": "Diffusion en direct :",
      "showing_copyrighted_lyrics_on_a_livestream": "afficher des paroles protégées par le droit d’auteur dans une diffusion en direct nécessite généralement une licence de diffusion en plus de la licence de droits d’auteur de l’église (par exemple CCLI ou OneLicense). Les exigences varient selon le pays et la plateforme — renseignez-vous auprès de votre fournisseur de licence. Les cantiques du domaine public n’en ont pas besoin. Indiquez le droit d’auteur et le numéro CCLI de chaque cantique dans son formulaire de modification.",
      "bible_translations": "Traductions de la Bible :",
      "you_are_responsible_for_having_the": "vous êtes responsable de disposer du droit d’utiliser les traductions que vous importez. Les textes du domaine public ou sous licence ouverte sont acceptables ; les autres nécessitent l’autorisation de l’éditeur.",
      "ask_for_a_second_press_before": "Demander un second appui avant de passer à l’élément suivant du programme",
      "copyright": "Droit d’auteur",
      "ccli": "N° CCLI",
      "name_optional": "Nom (facultatif)",
      "search_by_title_author_or_number": "Rechercher par titre, auteur ou numéro…",
      "reference_or_label": "Référence ou libellé",
      "enter_text": "Saisissez le texte…",
      "type_any_text_to_send_to": "Saisissez un texte à envoyer à l’affichage (Écriture, annonce, écran noir...)",
      "leave_blank_if_none": "(laisser vide si aucun)",
      "e_g_public_domain_or_1990": "p. ex., Domaine public, ou © 1990 Éditeur",
      "take_the_screen_down_without_losing": "Masquer l’écran sans perdre votre place (B)",
      "bring_back_what_was_on_screen": "Rétablir ce qui était affiché avant Noir / Effacer (Z)",
      "keyboard_shortcuts": "Raccourcis clavier (?)",
      "previous_item_in_service": "Élément précédent du programme",
      "next_item_in_service": "Élément suivant du programme",
      "import_a_service_schedule_from_a": "Importer un programme de culte depuis un fichier texte",
      "active_translation": "Traduction active",
      "look_up_verse": "Rechercher un verset",
      "skip_the_confidence_preview_planned_scripture": "Ignorer l’aperçu de contrôle : les passages prévus vont directement à l’affichage lorsqu’ils sont activés",
      "on_the_last_verse_the_first": "Au dernier verset, le premier appui sur Suivant ne fait que préparer l’avance ; un second appui en quelques secondes passe à l’élément suivant du programme",
      "storage_type": "Type de stockage",
      "main_navigation": "Navigation principale",
      "keyboard_shortcuts_2": "Raccourcis clavier",
      "filter_by_source": "Filtrer par source",
      "hymns_library": "Bibliothèque de cantiques",
      "select_hymn_file_to_import": "Sélectionner un fichier de cantiques à importer",
      "translation_name_optional_filled_in_automaticall": "Nom de la traduction (facultatif, rempli automatiquement)",
      "select_a_bible_file": "Sélectionner un fichier de Bible",
      "select_service_schedule_text_file": "Sélectionner le fichier texte du programme de culte",
      "saved_services": "Programmes enregistrés",
      "jump_to_verse": "Aller au verset",
      "scripture_reference": "Référence biblique",
      "bible_translation": "Traduction de la Bible",
      "verse_text": "Texte du verset",
      "previous_page": "Page précédente",
      "next_page": "Page suivante",
      "background_opacity_2": "Opacité de l’arrière-plan"
    },
    "drop": {
      "overlay": "Déposez pour importer",
      "unsupported": "Ce type de fichier ne peut pas être importé. Utilisez un fichier de cantiques (.txt, .csv, .json, .cho, .usr), de Bible (.zip, .json, .usfm), un programme de culte (.txt) ou une sauvegarde HymnFlow (.json)."
    },
    "msg": {
      "noSnapshots": "Aucun instantané pour l’instant",
      "shortcutsNote": "Les raccourcis fonctionnent lorsque le dock est actif. Pour des touches valables depuis n’importe quelle fenêtre, connectez les raccourcis OBS dans Style → Connexion à OBS.",
      "hotkeysOn": "Raccourcis globaux : activés",
      "hotkeysConnecting": "Raccourcis globaux : connexion…",
      "hotkeysOff": "Raccourcis globaux : désactivés",
      "hotkeysConnected": "Raccourcis OBS connectés",
      "storageFullHymns": "Stockage plein ({count} cantiques). Exportez vos cantiques puis libérez de l’espace pour continuer.",
      "storageFull": "Stockage plein — exportez des cantiques pour libérer de l’espace.",
      "errorSavingHymns": "Erreur d’enregistrement des cantiques : {error}",
      "errorSavingSettings": "Erreur d’enregistrement des réglages : {error}",
      "errorSavingServices": "Erreur d’enregistrement des programmes : {error}",
      "bibleNotLoaded": "Bible non chargée — importez une traduction dans l’onglet Bibliothèque",
      "draftRestored": "Brouillon de programme non enregistré restauré",
      "listLabel": "Libellé de la liste : « {label} »",
      "cueNotes": "Notes de repère — {item}",
      "serviceDeletedShort": "Programme supprimé",
      "duplicated": "Dupliqué : « {name} »",
      "serviceImportEmpty": "Échec de l’importation : aucun élément de programme trouvé dans le fichier",
      "serviceImported": "« {name} » importé — {count} élément(s){warnings}",
      "warningsCount": "{count} avertissement(s)",
      "serviceImportWarnings": "Programme importé avec des avertissements :",
      "couldNotRead": "Impossible de lire le fichier",
      "importing": "Importation… ({done}/{total})",
      "importFailed": "Échec de l’importation : {error}",
      "kjvLoaded": "KJV chargée — prête pour la recherche de versets",
      "noUsage": "Aucun cantique n’a encore été affiché.",
      "clearUsageConfirm": "Effacer le journal d’utilisation de cet appareil ? Exportez-le d’abord si vous en avez besoin pour déclarer.",
      "clear": "Effacer",
      "usageCleared": "Journal d’utilisation effacé",
      "creditsIntro": "Crédits des traductions chargées (à indiquer dans les crédits de votre église) :",
      "open": "Ouvrir",
      "copyLink": "Copier le lien",
      "linkCopied": "Lien copié",
      "copyManually": "Sélectionnez le texte du lien ci-dessus et copiez-le (Ctrl+C)",
      "hotkeysSetupTitle": "Cliquez pour configurer les raccourcis globaux (Style → Connexion à OBS)"
    },
    "bibleGet": {
      "otherLanguages": "Autres langues",
      "license": {
        "pd": "Domaine public",
        "bibliatodo": "Licence gratuite (BibliaTodo v1.9) — mention obligatoire",
        "ccbysa": "CC BY-SA 4.0 — mentionner Biblica",
        "varies": "Variable — vérifiez chaque traduction"
      },
      "steps": {
        "save": "Enregistrez le fichier, puis déposez-le sur la carte Bible ci-dessus.",
        "zip": "Téléchargez le ZIP JSON et déposez-le sur la carte Bible ci-dessus (inutile de le décompresser).",
        "ntbt": "Déposez le ZIP téléchargé sur la carte Bible ci-dessus (inutile de le décompresser).",
        "yoruba": "Sur la page, téléchargez la version USFM (.zip) et déposez-la sur la carte Bible ci-dessus — HymnFlow la convertit pour vous.",
        "ebible": "Des centaines de traductions. Téléchargez la version USFM (.zip) et déposez-la sur la carte Bible ci-dessus."
      }
    },
    "operator": {
      "corruptKept": "Les données enregistrées de {name} sont illisibles. Une copie a été conservée dans le stockage du navigateur (hymnflow-corrupt-{name}-*) pour pouvoir la récupérer.",
      "restore": "Rétablir",
      "noSnapshot": "Cet instantané n’est plus disponible.",
      "notBackup": "Ce fichier n’est pas une sauvegarde HymnFlow.",
      "emptyBackup": "La sauvegarde ne contient aucun cantique utilisable.",
      "undo": "Annuler",
      "undone": "Rétabli",
      "nothingToRestore": "Rien à rétablir",
      "restored": "Ce qui était à l’écran a été rétabli",
      "pressAgain": "Dernier verset — appuyez encore sur Suivant pour {item}",
      "blanked": "Écran noirci",
      "cleared": "Écran effacé",
      "hymnDeleted": "« {title} » supprimé",
      "serviceDeleted": "Programme « {name} » supprimé"
    }
  },
  "ko": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "OBS HYMN용 하단 3분위 컨트롤러 by @gbcowode",
      "status": {
        "live": "라이브",
        "storage": "localStorage",
        "ready": "준비됨 ({storage})",
        "hymnUpdated": "찬송가가 업데이트되었습니다",
        "hymnAdded": "찬송가가 추가되었습니다"
      },
      "errors": {
        "sendFailed": "오버레이로 전송 중 오류 발생: {error}"
      }
    },
    "hymns": {
      "title": "찬송가",
      "searchPlaceholder": "찬송가 검색",
      "searchLabel": "제목, 저자 또는 번호로 찬송가 검색",
      "noHymnsFound": "찬송가를 찾을 수 없습니다",
      "noHymnSelected": "선택된 찬송가 없음",
      "selectedTitle": "선택된 찬송가 제목",
      "buttons": {
        "add": "+ 추가",
        "edit": "✏️ 편집",
        "remove": "- 삭제",
        "import": "가져오기",
        "export": "내보내기"
      },
      "labels": {
        "hymnNumber": "찬송가 번호",
        "sourceAbbr": "출처 약어",
        "sourceName": "출처 이름",
        "title": "제목",
        "author": "저자",
        "verses": "절",
        "chorus": "후렴",
        "versesSeparator": "(절 사이를 빈 줄로 구분)",
        "chorusOptional": "(선택 사항)",
        "required": "*",
        "versesCount": "{count}절"
      },
      "placeholders": {
        "number": "예: 123",
        "sourceAbbr": "예: CH, PD, HB",
        "sourceName": "예: 찬송가집, 퍼블릭 도메인",
        "title": "찬송가 제목",
        "author": "저자 이름",
        "verses": "1절 텍스트\n\n2절 텍스트\n\n3절 텍스트",
        "chorus": "후렴 텍스트"
      },
      "alerts": {
        "noChorus": "이 찬송가에는 후렴이 없습니다",
        "noHymnSelected": "선택된 찬송가 없음",
        "noHymnToEdit": "편집할 찬송가가 선택되지 않았습니다",
        "titleRequired": "제목은 필수입니다",
        "versesRequired": "최소 한 절 이상 필요합니다",
        "validationFailed": "찬송가 검증 실패:\n{errors}",
        "importFailed": "가져오기 실패: {error}"
      },
      "confirmations": {
        "delete": "\"{title}\"을(를) 삭제하시겠습니까?"
      },
      "status": {
        "exported": "{filename} 파일로 내보냈습니다",
        "imported": "찬송가 {count}곡을 가져왔습니다{skipped}"
      }
    },
    "services": {
      "title": "예배 순서",
      "newButton": "+ 새로 만들기",
      "namePlaceholder": "순서 이름 (예: 주일 오전 예배)",
      "noServicesFound": "생성된 예배 순서가 없습니다",
      "noHymnsInService": "아직 추가된 찬송가가 없습니다",
      "hymnsCount": "찬송가 {count}곡",
      "buttons": {
        "addHymn": "+ 찬송가 추가",
        "save": "순서 저장",
        "cancel": "취소",
        "load": "불러오기",
        "edit": "편집",
        "delete": "삭제"
      },
      "alerts": {
        "nameRequired": "순서 이름은 필수입니다",
        "atLeastOneHymn": "순서에 최소 한 곡 이상의 찬송가를 추가하세요",
        "validationFailed": "순서 검증 실패:\n{errors}",
        "itemRequired": "예배 순서에 항목을 하나 이상 추가하세요"
      },
      "confirmations": {
        "delete": "이 예배 순서를 삭제하시겠습니까?"
      },
      "status": {
        "validationIssues": "경고: 순서에 검증 문제가 있습니다",
        "loaded": "순서를 불러왔습니다: {name} ({count}곡)",
        "deleted": "순서가 삭제되었습니다",
        "saved": "순서가 저장되었습니다",
        "hymnNotFound": "라이브러리에서 찬송가를 찾을 수 없음",
        "divider": "▸ {label}",
        "hymnDeleted": "찬송가를 삭제했습니다(예배 순서 {count}개 업데이트됨)"
      },
      "errors": {
        "saveFailed": "순서 저장 중 오류 발생: {error}"
      },
      "addButtons": {
        "announce": "+ 공지",
        "divider": "+ 구분선",
        "hymn": "+ 찬송가",
        "scripture": "+ 성구"
      },
      "banner": {
        "nextItem": "다음 예배 항목",
        "prevItem": "이전 예배 항목"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "공지 추가",
          "addDivider": "구분선 추가",
          "addScripture": "성구 추가",
          "save": "저장"
        },
        "placeholders": {
          "announceText": "공지 내용(예: 예배 후 교제 시간에 함께해 주세요)",
          "dividerLabel": "구간 이름(예: 헌금, 설교, 기도)",
          "scriptureRef": "참조(예: 요한복음 3:16)",
          "scriptureText": "구절 본문(예: 하나님이 세상을 이처럼 사랑하사…)"
        },
        "titles": {
          "addAnnounce": "공지 추가",
          "addDivider": "구분선 추가",
          "addScripture": "성구 추가",
          "editAnnounce": "공지 편집",
          "editDivider": "구분선 편집",
          "editScripture": "성구 편집"
        }
      }
    },
    "textSlide": {
      "title": "텍스트 슬라이드",
      "hint": "성경 구절, 공지사항, 빈 화면",
      "sendButton": "오버레이로 전송",
      "clearButton": "슬라이드 지우기",
      "sent": "텍스트 슬라이드 전송됨",
      "cleared": "텍스트 슬라이드 지워짐"
    },
    "bible": {
      "title": "성경",
      "label": "성경",
      "description": "어떤 번역본이든 JSON 파일을 가져와 구절 검색을 활성화하세요. 각 번역본은 별도로 저장되며 언제든지 전환할 수 있습니다.",
      "importButton": "JSON 가져오기",
      "loading": "성경 로딩 중…",
      "notLoaded": "로드되지 않음"
    },
    "quickScripture": {
      "title": "빠른 성경",
      "hint": "라이브 · 즉석",
      "refPlaceholder": "참조 (예: 요한복음 3:16)",
      "textPlaceholder": "절 텍스트 — 빈 줄이 페이지를 구분합니다",
      "lookupButton": "🔍",
      "displayButton": "표시",
      "clearButton": "지우기",
      "status": "성경: {ref}",
      "statusNoRef": "성경이 표시되었습니다"
    },
    "navigation": {
      "verseInfo": "{current}/{total}절 · {totalLines}행 중 {startLine}-{endLine}행",
      "buttons": {
        "prevVerse": "⟵ 이전 절",
        "nextVerse": "다음 절 ⟶",
        "prevLine": "⬆ 이전 행",
        "nextLine": "⬇ 다음 행",
        "jumpChorus": "후렴으로 이동",
        "emergencyClear": "비상 초기화"
      },
      "tooltips": {
        "prevVerse": "이전 절 (왼쪽 화살표)",
        "nextVerse": "다음 절 (오른쪽 화살표)",
        "prevLine": "이전 행 창 (위쪽 화살표)",
        "nextLine": "다음 행 창 (아래쪽 화살표)",
        "jumpChorus": "사용 가능한 경우 후렴 표시",
        "emergencyClear": "스트림에서 오버레이 즉시 숨기기"
      },
      "chorusNext": " · 다음은 후렴",
      "lastChorus": " · 마지막 후렴",
      "lastVerse": " · 마지막 절",
      "shrinksToFit": " · ⚠ 맞추려고 축소됨",
      "chorusInfo": "후렴 · {totalLines}줄 중 {startLine}-{endLine}줄"
    },
    "display": {
      "title": "표시 제어",
      "displayLabel": "표시",
      "liveIndicator": "라이브",
      "resetButton": "초기화",
      "resetTooltip": "첫 절, 첫 행으로 초기화",
      "linesPerDisplay": "화면당 행 수",
      "blanked": "화면이 비워졌습니다 — 표시 또는 빠른 성구가 다시 불러옵니다",
      "displayOffHint": "표시가 꺼져 있습니다 — 이 찬송가를 보이려면 표시 스위치를 켜세요",
      "hotkeysReconnecting": "OBS 단축키 연결이 끊겼습니다 — 다시 연결 중…",
      "noHymnSelected": "표시할 내용이 없습니다 — 먼저 찬송가를 선택하세요",
      "offHint": "표시가 꺼져 있습니다 — 이 찬송가를 보이려면 표시 스위치를 켜세요"
    },
    "preview": {
      "title": "찬송가 미리보기"
    },
    "styles": {
      "title": "스타일",
      "fontFamily": "글꼴",
      "fontSize": "글꼴 크기",
      "bold": "굵게",
      "italic": "기울임꼴",
      "shadow": "그림자",
      "glow": "광택",
      "outline": "외곽선",
      "outlineColor": "외곽선 색상",
      "outlineWidth": "외곽선 두께",
      "textColor": "텍스트 색상",
      "bgType": "배경 유형",
      "bgColorA": "배경 색상 A",
      "bgColorB": "배경 색상 B (그라데이션용)",
      "animation": "애니메이션",
      "position": "위치",
      "bgTypes": {
        "transparent": "투명",
        "solid": "단색",
        "gradient": "그라데이션"
      },
      "animations": {
        "fade": "페이드",
        "slide": "슬라이드",
        "none": "없음"
      },
      "positions": {
        "bottom": "하단 3분위",
        "middle": "중간",
        "top": "상단"
      }
    },
    "modal": {
      "editHymn": "찬송가 편집",
      "addHymn": "찬송가 추가",
      "buttons": {
        "cancel": "취소",
        "save": "변경 사항 저장",
        "addAnyway": "그래도 추가",
        "delete": "삭제",
        "discard": "버리기",
        "ok": "확인"
      },
      "confirmations": {
        "badReference": "\"{ref}\"은(는) 올바른 성경 참조가 아닌 것 같습니다.\n그래도 추가할까요?",
        "discard": "저장하지 않은 변경 사항을 버릴까요?"
      }
    },
    "settings": {
      "title": "설정",
      "language": "언어",
      "languageLabel": "인터페이스 언어"
    },
    "tabs": {
      "library": "라이브러리",
      "service": "서비스",
      "live": "라이브",
      "style": "스타일"
    },
    "setup": {
      "import": {
        "selectFile": "다운로드한 .json, .txt 또는 .csv 파일을 선택하세요"
      },
      "controls": {
        "exportDesc": "hymnflow-export.json에 찬송가를 저장합니다"
      },
      "features": {
        "importFormats": ".txt, .csv 또는 .json 파일 가져오기"
      },
      "importFormats": {
        "csv": "CSV 형식"
      }
    },
    "ui": {
      "blank_screen": "화면 비우기",
      "restore": "↩ 복원",
      "shortcuts": "? 단축키",
      "tip_drop_any_downloaded_file_anywhere": "팁: 다운로드한 파일(성경 .zip/.json/USFM, 찬송가, 예배 순서, 백업)을 독 아무 곳에나 놓으세요. HymnFlow가 종류를 알아내어 압축 해제와 변환까지 해 줍니다.",
      "get_another_translation": "다른 번역본 받기",
      "hymnflow_never_downloads_anything_itself_pick": "HymnFlow는 스스로 아무것도 다운로드하지 않습니다. 언어를 고르고 링크를 열어 파일을 저장한 뒤 위의 성경 카드에 놓으세요. 압축 해제나 변환은 필요 없습니다. 각 번역본의 라이선스를 확인하세요.",
      "language": "언어",
      "import": "가져오기",
      "cancel": "취소",
      "auto_display_planned_scripture": "계획된 성구 자동 표시",
      "background_opacity": "배경 불투명도",
      "scripture_display": "성구 표시",
      "scripture_font": "성구 글꼴",
      "classic_serif_default": "클래식 세리프(기본)",
      "same_as_lyrics": "가사와 동일",
      "italic_text": "기울임꼴",
      "show_reference": "참조 표시",
      "translation_badge": "번역본 배지",
      "custom_size": "사용자 지정 크기",
      "scripture_font_size": "성구 글꼴 크기",
      "obs_connection": "OBS 연결",
      "host": "호스트",
      "port": "포트",
      "password": "비밀번호",
      "connect": "연결",
      "disconnect": "연결 끊기",
      "hotkeys_dock_focus": "단축키(독에 포커스가 있을 때)",
      "data_backup": "데이터 및 백업",
      "hymns_services_and_settings_are_stored": "찬송가, 예배 순서, 설정은 이 브라우저에 저장됩니다. 독을 열 때마다 자동으로 스냅샷이 만들어지며, 찬송가나 순서를 삭제해도 몇 초 안에 되돌릴 수 있습니다.",
      "export_backup": "백업 내보내기…",
      "restore_from_file": "파일에서 복원…",
      "usage_report_each_hymn_put_on": "사용 보고서: 화면에 표시한 찬송가는 이 기기에 기록되어(날짜, 제목, CCLI 번호) CCLI에 보고할 수 있습니다. 어디로도 전송되지 않습니다.",
      "export_usage_report_csv": "사용 보고서 내보내기(CSV)…",
      "clear_usage_log": "사용 기록 지우기",
      "automatic_snapshots": "자동 스냅샷",
      "restore_selected_snapshot": "선택한 스냅샷 복원",
      "bibles_are_stored_separately_and_are": "성경은 별도로 저장되며 백업이나 복원의 영향을 받지 않습니다. OBS 연결 정보와 비밀번호는 백업 파일에 절대 기록되지 않습니다.",
      "licensing_credits": "라이선스 및 크레딧",
      "livestreaming": "라이브 스트리밍:",
      "showing_copyrighted_lyrics_on_a_livestream": "저작권이 있는 가사를 라이브 방송에 표시하려면 일반 교회 저작권 라이선스 외에 스트리밍 라이선스(예: CCLI, OneLicense)가 필요한 경우가 많습니다. 요건은 국가와 플랫폼마다 다르니 라이선스 제공처에 확인하세요. 공공 도메인 찬송가는 필요 없습니다. 각 찬송가의 편집 화면에 저작권과 CCLI 번호를 기록하세요.",
      "bible_translations": "성경 번역본:",
      "you_are_responsible_for_having_the": "가져오는 번역본을 사용할 권리가 있는지 확인할 책임은 사용자에게 있습니다. 공공 도메인이나 공개 라이선스 텍스트는 괜찮지만, 그 외에는 출판사의 허락이 필요합니다.",
      "ask_for_a_second_press_before": "다음 예배 항목으로 넘어가기 전에 한 번 더 누르도록 하기",
      "copyright": "저작권",
      "ccli": "CCLI 번호",
      "name_optional": "이름(선택)",
      "search_by_title_author_or_number": "제목, 작가 또는 번호로 검색…",
      "reference_or_label": "참조 또는 라벨",
      "enter_text": "텍스트 입력…",
      "type_any_text_to_send_to": "오버레이로 보낼 텍스트를 입력하세요(성구, 공지, 빈 화면…)",
      "leave_blank_if_none": "(없으면 비워 두세요)",
      "e_g_public_domain_or_1990": "예: 공공 도메인 또는 © 1990 출판사",
      "take_the_screen_down_without_losing": "현재 위치를 잃지 않고 화면 내리기(B)",
      "bring_back_what_was_on_screen": "비우기/지우기 전에 화면에 있던 내용 되돌리기(Z)",
      "keyboard_shortcuts": "키보드 단축키(?)",
      "previous_item_in_service": "이전 예배 항목",
      "next_item_in_service": "다음 예배 항목",
      "import_a_service_schedule_from_a": "텍스트 파일에서 예배 순서 가져오기",
      "active_translation": "사용 중인 번역본",
      "look_up_verse": "구절 찾기",
      "skip_the_confidence_preview_planned_scripture": "확인용 미리보기 건너뛰기: 계획된 성구는 활성화하면 바로 화면에 표시됩니다",
      "on_the_last_verse_the_first": "마지막 절에서 '다음'을 처음 누르면 준비만 되고, 몇 초 안에 한 번 더 누르면 다음 예배 항목으로 넘어갑니다",
      "storage_type": "저장소 유형",
      "main_navigation": "주 메뉴",
      "keyboard_shortcuts_2": "키보드 단축키",
      "filter_by_source": "출처별 필터",
      "hymns_library": "찬송가 라이브러리",
      "select_hymn_file_to_import": "가져올 찬송가 파일 선택",
      "translation_name_optional_filled_in_automaticall": "번역본 이름(선택, 자동 입력)",
      "select_a_bible_file": "성경 파일 선택",
      "select_service_schedule_text_file": "예배 순서 텍스트 파일 선택",
      "saved_services": "저장된 예배 순서",
      "jump_to_verse": "절로 이동",
      "scripture_reference": "성구 참조",
      "bible_translation": "성경 번역본",
      "verse_text": "구절 본문",
      "previous_page": "이전 페이지",
      "next_page": "다음 페이지",
      "background_opacity_2": "배경 불투명도"
    },
    "drop": {
      "overlay": "놓아서 가져오기",
      "unsupported": "이 형식의 파일은 가져올 수 없습니다. 찬송가 파일(.txt, .csv, .json, .cho, .usr), 성경 파일(.zip, .json, .usfm), 예배 순서(.txt) 또는 HymnFlow 백업(.json)을 사용하세요."
    },
    "msg": {
      "noSnapshots": "아직 스냅샷이 없습니다",
      "shortcutsNote": "단축키는 독에 포커스가 있을 때 작동합니다. 어느 창에서나 작동하는 키를 쓰려면 스타일 → OBS 연결에서 OBS 단축키를 연결하세요.",
      "hotkeysOn": "전역 단축키: 켜짐",
      "hotkeysConnecting": "전역 단축키: 연결 중…",
      "hotkeysOff": "전역 단축키: 꺼짐",
      "hotkeysConnected": "OBS 단축키 연결됨",
      "storageFullHymns": "저장 공간이 가득 찼습니다(찬송가 {count}곡). 찬송가를 내보낸 뒤 저장 공간을 비우고 계속하세요.",
      "storageFull": "저장 공간이 가득 찼습니다 — 찬송가를 내보내 공간을 확보하세요.",
      "errorSavingHymns": "찬송가 저장 오류: {error}",
      "errorSavingSettings": "설정 저장 오류: {error}",
      "errorSavingServices": "예배 순서 저장 오류: {error}",
      "bibleNotLoaded": "성경이 로드되지 않았습니다 — 라이브러리 탭에서 번역본을 가져오세요",
      "draftRestored": "저장하지 않은 예배 순서 초안을 복원했습니다",
      "listLabel": "목록 라벨: \"{label}\"",
      "cueNotes": "큐 노트 — {item}",
      "serviceDeletedShort": "예배 순서를 삭제했습니다",
      "duplicated": "복제됨: \"{name}\"",
      "serviceImportEmpty": "가져오기 실패: 파일에서 예배 항목을 찾을 수 없습니다",
      "serviceImported": "\"{name}\" 가져옴 — 항목 {count}개{warnings}",
      "warningsCount": "경고 {count}개",
      "serviceImportWarnings": "경고와 함께 예배 순서를 가져왔습니다:",
      "couldNotRead": "파일을 읽을 수 없습니다",
      "importing": "가져오는 중… ({done}/{total})",
      "importFailed": "가져오기 실패: {error}",
      "kjvLoaded": "KJV 로드됨 — 성구 검색 준비 완료",
      "noUsage": "아직 표시한 찬송가가 없습니다.",
      "clearUsageConfirm": "이 기기의 사용 기록을 지울까요? 보고에 필요하면 먼저 내보내세요.",
      "clear": "지우기",
      "usageCleared": "사용 기록을 지웠습니다",
      "creditsIntro": "불러온 번역본의 크레딧(교회 크레딧에 기재하세요):",
      "open": "열기",
      "copyLink": "링크 복사",
      "linkCopied": "링크를 복사했습니다",
      "copyManually": "위의 링크 텍스트를 선택해 복사하세요(Ctrl+C)",
      "hotkeysSetupTitle": "전역 단축키를 설정하려면 클릭하세요(스타일 → OBS 연결)"
    },
    "bibleGet": {
      "otherLanguages": "기타 언어",
      "license": {
        "pd": "공공 도메인",
        "bibliatodo": "무료 라이선스(BibliaTodo v1.9) — 출처 표기 필요",
        "ccbysa": "CC BY-SA 4.0 — Biblica 표기",
        "varies": "번역본마다 다름 — 각각 확인하세요"
      },
      "steps": {
        "save": "파일을 저장한 뒤 위의 성경 카드에 놓으세요.",
        "zip": "JSON ZIP을 내려받아 위의 성경 카드에 놓으세요(압축 해제 불필요).",
        "ntbt": "내려받은 ZIP을 위의 성경 카드에 놓으세요(압축 해제 불필요).",
        "yoruba": "해당 페이지에서 USFM(.zip) 버전을 내려받아 위의 성경 카드에 놓으세요. HymnFlow가 변환해 줍니다.",
        "ebible": "수백 개의 번역본. USFM(.zip) 버전을 내려받아 위의 성경 카드에 놓으세요."
      }
    },
    "operator": {
      "corruptKept": "저장된 {name} 데이터를 읽을 수 없습니다. 복구할 수 있도록 브라우저 저장소에 사본(hymnflow-corrupt-{name}-*)을 보관했습니다.",
      "restore": "복원",
      "noSnapshot": "해당 스냅샷은 더 이상 사용할 수 없습니다.",
      "notBackup": "이 파일은 HymnFlow 백업이 아닙니다.",
      "emptyBackup": "백업에 사용할 수 있는 찬송가가 없습니다.",
      "undo": "되돌리기",
      "undone": "복원됨",
      "nothingToRestore": "복원할 항목이 없습니다",
      "restored": "화면에 있던 내용을 복원했습니다",
      "pressAgain": "마지막 절 — {item}(으)로 가려면 '다음'을 한 번 더 누르세요",
      "blanked": "화면을 비웠습니다",
      "cleared": "화면을 지웠습니다",
      "hymnDeleted": "\"{title}\" 삭제됨",
      "serviceDeleted": "예배 순서 \"{name}\" 삭제됨"
    }
  },
  "pt": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "Controlador de terço inferior para OBS HYMN by @gbcowode",
      "status": {
        "live": "AO VIVO",
        "ready": "Pronto ({storage})",
        "hymnUpdated": "Hino atualizado",
        "hymnAdded": "Hino adicionado",
        "storage": "localStorage"
      },
      "errors": {
        "sendFailed": "Erro ao enviar para a sobreposição: {error}"
      }
    },
    "hymns": {
      "title": "Hinos",
      "searchPlaceholder": "Pesquisar hinos",
      "searchLabel": "Pesquisar hinos por título, autor ou número",
      "noHymnsFound": "Nenhum hino encontrado",
      "noHymnSelected": "Nenhum hino selecionado",
      "selectedTitle": "Título do hino selecionado",
      "buttons": {
        "add": "+ Adicionar",
        "edit": "✏️ Editar",
        "remove": "- Remover",
        "import": "Importar",
        "export": "Exportar"
      },
      "labels": {
        "hymnNumber": "Número do hino",
        "sourceAbbr": "Abreviação da fonte",
        "sourceName": "Nome da fonte",
        "title": "Título",
        "author": "Autor",
        "verses": "Versos",
        "chorus": "Refrão",
        "versesSeparator": "(separe os versos com linha em branco)",
        "chorusOptional": "(opcional)",
        "required": "*",
        "versesCount": "{count} verso(s)"
      },
      "placeholders": {
        "number": "ex., 123",
        "sourceAbbr": "ex., HC, DP, HB",
        "sourceName": "ex., Hinário Cristão, Domínio Público",
        "title": "Título do hino",
        "author": "Nome do autor",
        "verses": "Texto do verso 1\n\nTexto do verso 2\n\nTexto do verso 3",
        "chorus": "Texto do refrão"
      },
      "alerts": {
        "noChorus": "Sem refrão disponível para este hino",
        "noHymnSelected": "Nenhum hino selecionado",
        "noHymnToEdit": "Nenhum hino selecionado para editar",
        "titleRequired": "O título é obrigatório",
        "versesRequired": "É necessário pelo menos um verso",
        "validationFailed": "Falha na validação do hino:\n{errors}",
        "importFailed": "Falha na importação: {error}"
      },
      "confirmations": {
        "delete": "Excluir \"{title}\"?"
      },
      "status": {
        "exported": "Hinos exportados para {filename}",
        "imported": "Importado(s) {count} hino(s){skipped}"
      }
    },
    "services": {
      "title": "Serviços",
      "newButton": "+ Novo",
      "namePlaceholder": "Nome do serviço (ex., Domingo de manhã)",
      "noServicesFound": "Nenhum serviço criado",
      "noHymnsInService": "Nenhum hino adicionado ainda",
      "hymnsCount": "{count} hino(s)",
      "buttons": {
        "addHymn": "+ Adicionar hino",
        "save": "Salvar serviço",
        "cancel": "Cancelar",
        "load": "Carregar",
        "edit": "Editar",
        "delete": "Excluir"
      },
      "alerts": {
        "nameRequired": "O nome do serviço é obrigatório",
        "atLeastOneHymn": "Adicione pelo menos um hino ao serviço",
        "validationFailed": "Falha na validação do serviço:\n{errors}",
        "itemRequired": "Adicione pelo menos um item à programação"
      },
      "confirmations": {
        "delete": "Excluir este serviço?"
      },
      "status": {
        "validationIssues": "Aviso: O serviço tem problemas de validação",
        "loaded": "Serviço carregado: {name} ({count} hinos)",
        "deleted": "Serviço excluído",
        "saved": "Serviço salvo",
        "hymnNotFound": "Hino não encontrado na biblioteca",
        "divider": "▸ {label}",
        "hymnDeleted": "Hino excluído ({count} programação(ões) atualizada(s))"
      },
      "errors": {
        "saveFailed": "Erro ao salvar os serviços: {error}"
      },
      "addButtons": {
        "announce": "+ Aviso",
        "divider": "+ Divisor",
        "hymn": "+ Hino",
        "scripture": "+ Escritura"
      },
      "banner": {
        "nextItem": "Próximo item da programação",
        "prevItem": "Item anterior da programação"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "Adicionar aviso",
          "addDivider": "Adicionar divisor",
          "addScripture": "Adicionar Escritura",
          "save": "Salvar"
        },
        "placeholders": {
          "announceText": "Texto do aviso (ex.: Participe da comunhão depois do culto)",
          "dividerLabel": "Rótulo da seção (ex.: Oferta, Sermão, Oração)",
          "scriptureRef": "Referência (ex.: João 3:16)",
          "scriptureText": "Texto do versículo (ex.: Porque Deus amou o mundo de tal maneira…)"
        },
        "titles": {
          "addAnnounce": "Adicionar aviso",
          "addDivider": "Adicionar divisor",
          "addScripture": "Adicionar Escritura",
          "editAnnounce": "Editar aviso",
          "editDivider": "Editar divisor",
          "editScripture": "Editar Escritura"
        }
      }
    },
    "textSlide": {
      "title": "Slide de Texto",
      "hint": "escritura, anúncio, tela em branco",
      "sendButton": "Enviar ao Overlay",
      "clearButton": "Limpar Slide",
      "sent": "Slide de texto enviado",
      "cleared": "Slide de texto removido"
    },
    "bible": {
      "title": "Bíblia",
      "label": "Bíblia",
      "description": "Importe um arquivo JSON de qualquer tradução para ativar a pesquisa de versículos. Cada tradução é armazenada separadamente — alterne entre elas a qualquer momento.",
      "importButton": "Importar JSON",
      "loading": "Carregando Bíblia…",
      "notLoaded": "Não carregada"
    },
    "quickScripture": {
      "title": "Escritura Rápida",
      "hint": "ao vivo · ad-hoc",
      "refPlaceholder": "Referência (ex., João 3:16)",
      "textPlaceholder": "Texto do versículo — linha em branco separa páginas",
      "lookupButton": "🔍",
      "displayButton": "Exibir",
      "clearButton": "Limpar",
      "status": "Escritura: {ref}",
      "statusNoRef": "Escritura exibida"
    },
    "navigation": {
      "verseInfo": "Verso {current}/{total} · Linhas {startLine}-{endLine} de {totalLines}",
      "buttons": {
        "prevVerse": "⟵ Anterior",
        "nextVerse": "Próximo ⟶",
        "prevLine": "⬆ Linha anterior",
        "nextLine": "⬇ Próxima linha",
        "jumpChorus": "Ir para o refrão",
        "emergencyClear": "Limpeza de emergência"
      },
      "tooltips": {
        "prevVerse": "Verso anterior (Seta esquerda)",
        "nextVerse": "Próximo verso (Seta direita)",
        "prevLine": "Janela de linha anterior (Seta para cima)",
        "nextLine": "Janela de próxima linha (Seta para baixo)",
        "jumpChorus": "Exibir refrão se disponível",
        "emergencyClear": "Ocultar imediatamente a sobreposição da transmissão"
      },
      "chorusNext": " · Refrão a seguir",
      "lastChorus": " · Último refrão",
      "lastVerse": " · Último versículo",
      "shrinksToFit": " · ⚠ reduz para caber",
      "chorusInfo": "Refrão · Linhas {startLine}-{endLine} de {totalLines}"
    },
    "display": {
      "title": "Controles de exibição",
      "displayLabel": "Exibição",
      "liveIndicator": "AO VIVO",
      "resetButton": "Redefinir",
      "resetTooltip": "Redefinir para o primeiro verso, primeira linha",
      "linesPerDisplay": "Linhas por exibição",
      "blanked": "Tela em branco — Exibir ou Escritura rápida a trará de volta",
      "displayOffHint": "A exibição está DESLIGADA — ligue a chave Exibir para mostrar este hino",
      "hotkeysReconnecting": "Atalhos do OBS desconectados — reconectando…",
      "noHymnSelected": "Nada para exibir — selecione um hino primeiro",
      "offHint": "A exibição está DESLIGADA — ligue a chave Exibir para mostrar este hino"
    },
    "preview": {
      "title": "Visualização de hinos"
    },
    "styles": {
      "title": "Estilos",
      "fontFamily": "Família da fonte",
      "fontSize": "Tamanho da fonte",
      "bold": "Negrito",
      "italic": "Itálico",
      "shadow": "Sombra",
      "glow": "Brilho",
      "outline": "Contorno",
      "outlineColor": "Cor do contorno",
      "outlineWidth": "Largura do contorno",
      "textColor": "Cor do texto",
      "bgType": "Tipo de fundo",
      "bgColorA": "Cor de fundo A",
      "bgColorB": "Cor de fundo B (para gradiente)",
      "animation": "Animação",
      "position": "Posição",
      "bgTypes": {
        "transparent": "Transparente",
        "solid": "Sólido",
        "gradient": "Gradiente"
      },
      "animations": {
        "fade": "Desvanecer",
        "slide": "Deslizar",
        "none": "Nenhum"
      },
      "positions": {
        "bottom": "Terço inferior",
        "middle": "Meio",
        "top": "Topo"
      }
    },
    "modal": {
      "editHymn": "Editar hino",
      "addHymn": "Adicionar hino",
      "buttons": {
        "cancel": "Cancelar",
        "save": "Salvar alterações",
        "addAnyway": "Adicionar mesmo assim",
        "delete": "Excluir",
        "discard": "Descartar",
        "ok": "OK"
      },
      "confirmations": {
        "badReference": "\"{ref}\" não parece uma referência bíblica válida.\nAdicionar mesmo assim?",
        "discard": "Descartar as alterações não salvas?"
      }
    },
    "settings": {
      "title": "Configurações",
      "language": "Idioma",
      "languageLabel": "Idioma da interface"
    },
    "tabs": {
      "library": "Biblioteca",
      "service": "Serviço",
      "live": "Ao Vivo",
      "style": "Estilo"
    },
    "setup": {
      "import": {
        "selectFile": "Selecione o arquivo baixado .json, .txt ou .csv"
      },
      "controls": {
        "exportDesc": "Salve os hinos em hymnflow-export.json"
      },
      "features": {
        "importFormats": "Importe arquivos .txt, .csv ou .json"
      },
      "importFormats": {
        "csv": "Formato CSV"
      }
    },
    "ui": {
      "blank_screen": "Tela em branco",
      "restore": "↩ Restaurar",
      "shortcuts": "? Atalhos",
      "tip_drop_any_downloaded_file_anywhere": "Dica: solte qualquer arquivo baixado em qualquer lugar do painel: uma Bíblia (.zip, .json, USFM), hinos, uma programação de culto ou um backup. O HymnFlow descobre o que é, descompacta e converte para você.",
      "get_another_translation": "Obter outra tradução",
      "hymnflow_never_downloads_anything_itself_pick": "O HymnFlow nunca baixa nada sozinho. Escolha um idioma, abra o link, salve o arquivo e solte-o sobre o cartão da Bíblia acima — não é preciso descompactar nem converter. Verifique a licença de cada tradução.",
      "language": "Idioma",
      "import": "Importar",
      "cancel": "Cancelar",
      "auto_display_planned_scripture": "Exibir automaticamente a Escritura planejada",
      "background_opacity": "Opacidade do fundo",
      "scripture_display": "Exibição da Escritura",
      "scripture_font": "Fonte da Escritura",
      "classic_serif_default": "Serifa clássica (padrão)",
      "same_as_lyrics": "Igual à letra",
      "italic_text": "Texto em itálico",
      "show_reference": "Mostrar referência",
      "translation_badge": "Selo da tradução",
      "custom_size": "Tamanho personalizado",
      "scripture_font_size": "Tamanho da fonte da Escritura",
      "obs_connection": "Conexão com o OBS",
      "host": "Host",
      "port": "Porta",
      "password": "Senha",
      "connect": "Conectar",
      "disconnect": "Desconectar",
      "hotkeys_dock_focus": "Atalhos (painel em foco)",
      "data_backup": "Dados e backup",
      "hymns_services_and_settings_are_stored": "Hinos, programações e ajustes ficam guardados neste navegador. Um instantâneo é feito automaticamente sempre que o painel abre, e você pode desfazer a exclusão de um hino ou programação por alguns segundos.",
      "export_backup": "Exportar backup…",
      "restore_from_file": "Restaurar de um arquivo…",
      "usage_report_each_hymn_put_on": "Relatório de uso: cada hino exibido na tela é registrado neste dispositivo (data, título, número CCLI) para que você possa reportar à CCLI. Nada é enviado para lugar nenhum.",
      "export_usage_report_csv": "Exportar relatório de uso (CSV)…",
      "clear_usage_log": "Limpar registro de uso",
      "automatic_snapshots": "Instantâneos automáticos",
      "restore_selected_snapshot": "Restaurar o instantâneo selecionado",
      "bibles_are_stored_separately_and_are": "As Bíblias ficam guardadas separadamente e não são alteradas por backup ou restauração. Os dados de conexão do OBS e a senha nunca são gravados em um arquivo de backup.",
      "licensing_credits": "Licenças e créditos",
      "livestreaming": "Transmissão ao vivo:",
      "showing_copyrighted_lyrics_on_a_livestream": "exibir letras protegidas por direitos autorais em uma transmissão ao vivo geralmente exige uma licença de transmissão, além da licença de direitos autorais da igreja (por exemplo CCLI ou OneLicense). Os requisitos variam por país e plataforma — consulte seu provedor de licenças. Hinos em domínio público não precisam. Registre os direitos autorais e o número CCLI de cada hino no formulário de edição.",
      "bible_translations": "Traduções da Bíblia:",
      "you_are_responsible_for_having_the": "você é responsável por ter o direito de usar as traduções que importar. Textos em domínio público ou com licença aberta não têm problema; os demais precisam de permissão do editor.",
      "ask_for_a_second_press_before": "Pedir um segundo toque antes de passar ao próximo item da programação",
      "copyright": "Direitos autorais",
      "ccli": "Nº CCLI",
      "name_optional": "Nome (opcional)",
      "search_by_title_author_or_number": "Buscar por título, autor ou número…",
      "reference_or_label": "Referência ou rótulo",
      "enter_text": "Digite o texto…",
      "type_any_text_to_send_to": "Digite qualquer texto para enviar à tela (Escritura, aviso, tela em branco...)",
      "leave_blank_if_none": "(deixe em branco se não houver)",
      "e_g_public_domain_or_1990": "ex.: Domínio público, ou © 1990 Editora",
      "take_the_screen_down_without_losing": "Retire a tela sem perder o lugar (B)",
      "bring_back_what_was_on_screen": "Traga de volta o que estava na tela antes de Branco / Limpar (Z)",
      "keyboard_shortcuts": "Atalhos de teclado (?)",
      "previous_item_in_service": "Item anterior da programação",
      "next_item_in_service": "Próximo item da programação",
      "import_a_service_schedule_from_a": "Importar uma programação de culto de um arquivo de texto",
      "active_translation": "Tradução ativa",
      "look_up_verse": "Buscar versículo",
      "skip_the_confidence_preview_planned_scripture": "Pular a pré-visualização de confiança: as passagens planejadas vão direto para a tela quando ativadas",
      "on_the_last_verse_the_first": "No último versículo, o primeiro toque em Próximo apenas prepara o avanço; um segundo toque em poucos segundos passa ao próximo item da programação",
      "storage_type": "Tipo de armazenamento",
      "main_navigation": "Navegação principal",
      "keyboard_shortcuts_2": "Atalhos de teclado",
      "filter_by_source": "Filtrar por fonte",
      "hymns_library": "Biblioteca de hinos",
      "select_hymn_file_to_import": "Selecionar arquivo de hinos para importar",
      "translation_name_optional_filled_in_automaticall": "Nome da tradução (opcional, preenchido automaticamente)",
      "select_a_bible_file": "Selecionar um arquivo da Bíblia",
      "select_service_schedule_text_file": "Selecionar arquivo de texto da programação",
      "saved_services": "Programações salvas",
      "jump_to_verse": "Ir para o versículo",
      "scripture_reference": "Referência bíblica",
      "bible_translation": "Tradução da Bíblia",
      "verse_text": "Texto do versículo",
      "previous_page": "Página anterior",
      "next_page": "Próxima página",
      "background_opacity_2": "Opacidade do fundo"
    },
    "drop": {
      "overlay": "Solte para importar",
      "unsupported": "Esse tipo de arquivo não pode ser importado. Use um arquivo de hinos (.txt, .csv, .json, .cho, .usr), de Bíblia (.zip, .json, .usfm), uma programação de culto (.txt) ou um backup do HymnFlow (.json)."
    },
    "msg": {
      "noSnapshots": "Ainda não há cópias",
      "shortcutsNote": "Os atalhos funcionam enquanto o painel está em foco. Para teclas que funcionem em qualquer janela, conecte os atalhos do OBS em Estilo → Conexão com o OBS.",
      "hotkeysOn": "Atalhos globais: ativados",
      "hotkeysConnecting": "Atalhos globais: conectando…",
      "hotkeysOff": "Atalhos globais: desativados",
      "hotkeysConnected": "Atalhos do OBS conectados",
      "storageFullHymns": "Armazenamento cheio ({count} hinos). Exporte seus hinos e depois libere espaço para continuar.",
      "storageFull": "Armazenamento cheio — exporte hinos para liberar espaço.",
      "errorSavingHymns": "Erro ao salvar os hinos: {error}",
      "errorSavingSettings": "Erro ao salvar os ajustes: {error}",
      "errorSavingServices": "Erro ao salvar as programações: {error}",
      "bibleNotLoaded": "Bíblia não carregada — importe uma tradução na aba Biblioteca",
      "draftRestored": "Rascunho da programação não salvo restaurado",
      "listLabel": "Rótulo da lista: \"{label}\"",
      "cueNotes": "Notas de deixa — {item}",
      "serviceDeletedShort": "Programação excluída",
      "duplicated": "Duplicado: \"{name}\"",
      "serviceImportEmpty": "Falha na importação: nenhum item de programação encontrado no arquivo",
      "serviceImported": "\"{name}\" importado — {count} item(ns){warnings}",
      "warningsCount": "{count} aviso(s)",
      "serviceImportWarnings": "Programação importada com avisos:",
      "couldNotRead": "Não foi possível ler o arquivo",
      "importing": "Importando… ({done}/{total})",
      "importFailed": "Falha na importação: {error}",
      "kjvLoaded": "KJV carregada — pronta para buscar versículos",
      "noUsage": "Nenhum hino foi exibido ainda.",
      "clearUsageConfirm": "Limpar o registro de uso deste dispositivo? Exporte-o antes se precisar dele para reportar.",
      "clear": "Limpar",
      "usageCleared": "Registro de uso limpo",
      "creditsIntro": "Créditos das traduções carregadas (inclua-os nos créditos da sua igreja):",
      "open": "Abrir",
      "copyLink": "Copiar link",
      "linkCopied": "Link copiado",
      "copyManually": "Selecione o texto do link acima e copie (Ctrl+C)",
      "hotkeysSetupTitle": "Clique para configurar os atalhos globais (Estilo → Conexão com o OBS)"
    },
    "bibleGet": {
      "otherLanguages": "Outros idiomas",
      "license": {
        "pd": "Domínio público",
        "bibliatodo": "Licença gratuita (BibliaTodo v1.9) — crédito obrigatório",
        "ccbysa": "CC BY-SA 4.0 — dar crédito à Biblica",
        "varies": "Varia — verifique cada tradução"
      },
      "steps": {
        "save": "Salve o arquivo e solte-o sobre o cartão da Bíblia acima.",
        "zip": "Baixe o ZIP JSON e solte-o sobre o cartão da Bíblia acima (não precisa descompactar).",
        "ntbt": "Solte o ZIP baixado sobre o cartão da Bíblia acima (não precisa descompactar).",
        "yoruba": "Na página, baixe a versão USFM (.zip) e solte-a sobre o cartão da Bíblia acima — o HymnFlow converte para você.",
        "ebible": "Centenas de traduções. Baixe a versão USFM (.zip) e solte-a sobre o cartão da Bíblia acima."
      }
    },
    "operator": {
      "corruptKept": "Os dados salvos de {name} não puderam ser lidos. Uma cópia foi mantida no armazenamento do navegador (hymnflow-corrupt-{name}-*) para recuperação.",
      "restore": "Restaurar",
      "noSnapshot": "Esse instantâneo não está mais disponível.",
      "notBackup": "Esse arquivo não é um backup do HymnFlow.",
      "emptyBackup": "O backup não contém hinos utilizáveis.",
      "undo": "Desfazer",
      "undone": "Restaurado",
      "nothingToRestore": "Nada para restaurar",
      "restored": "O que estava na tela foi restaurado",
      "pressAgain": "Último versículo — toque em Próximo de novo para {item}",
      "blanked": "Tela em branco",
      "cleared": "Tela limpa",
      "hymnDeleted": "\"{title}\" excluído",
      "serviceDeleted": "Programação \"{name}\" excluída"
    }
  },
  "sw": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "Kidhibiti cha sehemu ya chini ya OBS HYMN by @gbcowode",
      "status": {
        "live": "MOJA KWA MOJA",
        "storage": "localStorage",
        "ready": "Tayari ({storage})",
        "hymnUpdated": "Wimbo umesasishwa",
        "hymnAdded": "Wimbo umeongezwa"
      },
      "errors": {
        "sendFailed": "Hitilafu wakati wa kutuma kwa mwangaliza: {error}"
      }
    },
    "hymns": {
      "title": "Nyimbo",
      "searchPlaceholder": "Tafuta nyimbo",
      "searchLabel": "Tafuta nyimbo kwa nambari, jina, au mwandishi",
      "noHymnsFound": "Hakuna nyimbo zilizopatikana",
      "noHymnSelected": "Hakuna wimbo uliochaguliwa",
      "selectedTitle": "Jina la wimbo uliochaguliwa",
      "buttons": {
        "add": "+ Ongeza",
        "edit": "✏️ Hariri",
        "remove": "- Ondoa",
        "import": "Ingiza",
        "export": "Toa"
      },
      "labels": {
        "hymnNumber": "Nambari ya wimbo",
        "sourceAbbr": "Kifupisho cha chanzo",
        "sourceName": "Jina la chanzo",
        "title": "Jina",
        "author": "Mwandishi",
        "verses": "Beti",
        "chorus": "Kiitikio",
        "versesSeparator": "(tenganisha beti kwa mstari tupu)",
        "chorusOptional": "(si lazima)",
        "required": "*",
        "versesCount": "Beti {count}"
      },
      "placeholders": {
        "number": "mfano, 123",
        "sourceAbbr": "mfano, CH, PD, HB",
        "sourceName": "mfano, Kitabu cha Nyimbo za Kanisa, Eneo la Umma",
        "title": "Jina la wimbo",
        "author": "Mwandishi",
        "verses": "Maandishi ya beti ya 1\n\nMaandishi ya beti ya 2\n\nMaandishi ya beti ya 3",
        "chorus": "Maandishi ya kiitikio"
      },
      "alerts": {
        "noChorus": "Hakuna kiitikio kwa wimbo huu",
        "noHymnSelected": "Hakuna wimbo uliochaguliwa",
        "noHymnToEdit": "Hakuna wimbo uliochaguliwa kuhariri",
        "titleRequired": "Jina la wimbo linahitajika",
        "versesRequired": "Angalau beti moja inahitajika",
        "validationFailed": "Uthibitishaji wa wimbo umeshindwa:\n{errors}",
        "importFailed": "Uingizaji umeshindwa: {error}"
      },
      "confirmations": {
        "delete": "Futa \"{title}\"?"
      },
      "status": {
        "exported": "Imehamishwa {filename}",
        "imported": "Imeingizwa beti {count}{skipped}"
      }
    },
    "services": {
      "title": "Huduma",
      "newButton": "+ Mpya",
      "namePlaceholder": "Jina la huduma (mfano, Jumapili asubuhi)",
      "noServicesFound": "Hakuna huduma zilizoundwa",
      "noHymnsInService": "Hakuna nyimbo zilizoongezwa bado",
      "hymnsCount": "{count} wimbo/nyimbo",
      "buttons": {
        "addHymn": "+ Ongeza wimbo",
        "save": "Hifadhi huduma",
        "cancel": "Ghairi",
        "load": "Pakia",
        "edit": "Hariri",
        "delete": "Futa"
      },
      "alerts": {
        "nameRequired": "Jina la huduma linahitajika",
        "atLeastOneHymn": "Ongeza angalau wimbo mmoja kwenye huduma",
        "validationFailed": "Uthibitishaji wa huduma umeshindwa:\n{errors}",
        "itemRequired": "Ongeza angalau kipengee kimoja kwenye ibada"
      },
      "confirmations": {
        "delete": "Futa huduma hii?"
      },
      "status": {
        "validationIssues": "Onyo: Huduma ina masuala ya uthibitishaji",
        "loaded": "Huduma iliyopakiwa: {name} ({count} nyimbo)",
        "deleted": "Huduma imefutwa",
        "saved": "Huduma imehifadhiwa",
        "hymnNotFound": "Wimbo haujapatikana kwenye maktaba",
        "divider": "▸ {label}",
        "hymnDeleted": "Wimbo umefutwa (ibada {count} zimesasishwa)"
      },
      "errors": {
        "saveFailed": "Hitilafu wakati wa kuhifadhi huduma: {error}"
      },
      "addButtons": {
        "announce": "+ Tangazo",
        "divider": "+ Kigawanyo",
        "hymn": "+ Wimbo",
        "scripture": "+ Maandiko"
      },
      "banner": {
        "nextItem": "Kipengee kinachofuata cha ibada",
        "prevItem": "Kipengee kilichotangulia cha ibada"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "Ongeza tangazo",
          "addDivider": "Ongeza kigawanyo",
          "addScripture": "Ongeza Maandiko",
          "save": "Hifadhi"
        },
        "placeholders": {
          "announceText": "Maandishi ya tangazo (mf., Jiunge nasi kwa ushirika baada ya ibada)",
          "dividerLabel": "Lebo ya sehemu (mf., Sadaka, Mahubiri, Sala)",
          "scriptureRef": "Rejeleo (mf., Yohana 3:16)",
          "scriptureText": "Maandishi ya mstari (mf., Kwa maana jinsi hii Mungu aliupenda ulimwengu…)"
        },
        "titles": {
          "addAnnounce": "Ongeza tangazo",
          "addDivider": "Ongeza kigawanyo",
          "addScripture": "Ongeza Maandiko",
          "editAnnounce": "Hariri tangazo",
          "editDivider": "Hariri kigawanyo",
          "editScripture": "Hariri Maandiko"
        }
      }
    },
    "textSlide": {
      "title": "Slaidi ya Maandishi",
      "hint": "maandiko, tangazo, skrini tupu",
      "sendButton": "Tuma kwa Overlay",
      "clearButton": "Futa Slaidi",
      "sent": "Slaidi ya maandishi imetumwa",
      "cleared": "Slaidi ya maandishi imefutwa"
    },
    "bible": {
      "title": "Biblia",
      "label": "Biblia",
      "description": "Ingiza faili la JSON la tafsiri yoyote kuwezesha utafutaji wa mistari. Kila tafsiri huhifadhiwa tofauti — badilisha kati yao wakati wowote.",
      "importButton": "Ingiza JSON",
      "loading": "Inapakia Biblia…",
      "notLoaded": "Haijapakiwa"
    },
    "quickScripture": {
      "title": "Maandiko ya Haraka",
      "hint": "moja kwa moja · ad-hoc",
      "refPlaceholder": "Rejeo (mf., Yohana 3:16)",
      "textPlaceholder": "Maandishi ya aya — mstari wazi unatenganisha kurasa",
      "lookupButton": "🔍",
      "displayButton": "Onyesha",
      "clearButton": "Futa",
      "status": "Maandiko: {ref}",
      "statusNoRef": "Maandiko yameonyeshwa"
    },
    "navigation": {
      "verseInfo": "Beti {current}/{total} · Mistari {startLine}-{endLine} ya {totalLines}",
      "buttons": {
        "prevVerse": "⟵ Iliyotangulia",
        "nextVerse": "Ifuatayo ⟶",
        "prevLine": "⬆ Mstari uliotangulia",
        "nextLine": "⬇ Mstari ufuatao",
        "jumpChorus": "Nenda kwa kiitikio",
        "emergencyClear": "Futa dharura"
      },
      "tooltips": {
        "prevVerse": "Beti iliyotangulia (Mshale wa kushoto)",
        "nextVerse": "Beti ifuatayo (Mshale wa kulia)",
        "prevLine": "Dirisha la mstari uliotangulia (Mshale wa juu)",
        "nextLine": "Dirisha la mstari ufuatao (Mshale wa chini)",
        "jumpChorus": "Onyesha kiitikio ikiwa inapatikana",
        "emergencyClear": "Ficha mara moja daraja kutoka kwa mtiririko"
      },
      "chorusNext": " · Kiitikio kinafuata",
      "lastChorus": " · Kiitikio cha mwisho",
      "lastVerse": " · Mstari wa mwisho",
      "shrinksToFit": " · ⚠ hupungua ili kutosha",
      "chorusInfo": "Kiitikio · Mistari {startLine}-{endLine} ya {totalLines}"
    },
    "display": {
      "title": "Vidhibiti vya kuonyesha",
      "displayLabel": "Onyesha",
      "liveIndicator": "MOJA KWA MOJA",
      "resetButton": "Weka upya",
      "resetTooltip": "Weka upya kwa beti ya kwanza, mstari wa kwanza",
      "linesPerDisplay": "Mistari kwa onyesho",
      "blanked": "Skrini imefifishwa — Onyesha au Maandiko ya Haraka yatairudisha",
      "displayOffHint": "Onyesho LIMEZIMWA — washa swichi ya Onyesha ili kuonyesha wimbo huu",
      "hotkeysReconnecting": "Hotkeys za OBS zimekatika — inaunganisha tena…",
      "noHymnSelected": "Hakuna cha kuonyesha — chagua wimbo kwanza",
      "offHint": "Onyesho LIMEZIMWA — washa swichi ya Onyesha ili kuonyesha wimbo huu"
    },
    "preview": {
      "title": "Maonyesho ya nyimbo"
    },
    "styles": {
      "title": "Mitindo",
      "fontFamily": "Familia ya fonti",
      "fontSize": "Ukubwa wa fonti",
      "bold": "Nzito",
      "italic": "Italiki",
      "shadow": "Kivuli",
      "glow": "Mwangaza",
      "outline": "Mpaka",
      "outlineColor": "Rangi ya mpaka",
      "outlineWidth": "Upana wa mpaka",
      "textColor": "Rangi ya maandishi",
      "bgType": "Aina ya mandharinyuma",
      "bgColorA": "Rangi ya mandharinyuma A",
      "bgColorB": "Rangi ya mandharinyuma B (kwa mwingiliano)",
      "animation": "Uhuishaji",
      "position": "Nafasi",
      "bgTypes": {
        "transparent": "Uwazi",
        "solid": "Imara",
        "gradient": "Mwingiliano"
      },
      "animations": {
        "fade": "Fifia",
        "slide": "Teleza",
        "none": "Hakuna"
      },
      "positions": {
        "bottom": "Sehemu ya chini",
        "middle": "Katikati",
        "top": "Juu"
      }
    },
    "modal": {
      "editHymn": "Hariri wimbo",
      "addHymn": "Ongeza wimbo",
      "buttons": {
        "cancel": "Ghairi",
        "save": "Hifadhi mabadiliko",
        "addAnyway": "Ongeza hata hivyo",
        "delete": "Futa",
        "discard": "Tupa",
        "ok": "Sawa"
      },
      "confirmations": {
        "badReference": "\"{ref}\" haionekani kuwa rejeleo sahihi la Biblia.\nIongezwe hata hivyo?",
        "discard": "Tupa mabadiliko ambayo hayajahifadhiwa?"
      }
    },
    "settings": {
      "title": "Mipangilio",
      "language": "Lugha",
      "languageLabel": "Lugha ya kiolesura"
    },
    "tabs": {
      "library": "Maktaba",
      "service": "Huduma",
      "live": "Moja kwa Moja",
      "style": "Mtindo"
    },
    "setup": {
      "import": {
        "selectFile": "Chagua faili iliyopakuliwa ya .json, .txt, au .csv"
      },
      "controls": {
        "exportDesc": "Hifadhi nyimbo kwenye hymnflow-export.json"
      },
      "features": {
        "importFormats": "Leta faili za .txt, .csv, au .json"
      },
      "importFormats": {
        "csv": "Muundo wa CSV"
      }
    },
    "ui": {
      "blank_screen": "Skrini tupu",
      "restore": "↩ Rejesha",
      "shortcuts": "? Njia za mkato",
      "tip_drop_any_downloaded_file_anywhere": "Kidokezo: dondosha faili yoyote uliyopakua popote kwenye dock — Biblia (.zip, .json, USFM), nyimbo, ratiba ya ibada au nakala ya akiba. HymnFlow hutambua ni nini, hufungua na kubadilisha kwa ajili yako.",
      "get_another_translation": "Pata tafsiri nyingine",
      "hymnflow_never_downloads_anything_itself_pick": "HymnFlow haipakui chochote yenyewe. Chagua lugha, fungua kiungo, hifadhi faili kisha liburute juu ya kadi ya Biblia hapo juu — hakuna haja ya kufungua wala kubadilisha. Angalia leseni ya kila tafsiri.",
      "language": "Lugha",
      "import": "Ingiza",
      "cancel": "Ghairi",
      "auto_display_planned_scripture": "Onyesha moja kwa moja Maandiko yaliyopangwa",
      "background_opacity": "Uwazi wa mandharinyuma",
      "scripture_display": "Onyesho la Maandiko",
      "scripture_font": "Fonti ya Maandiko",
      "classic_serif_default": "Serif ya kawaida (chaguo-msingi)",
      "same_as_lyrics": "Sawa na maneno ya wimbo",
      "italic_text": "Maandishi yaliyoinama",
      "show_reference": "Onyesha rejeleo",
      "translation_badge": "Alama ya tafsiri",
      "custom_size": "Ukubwa maalum",
      "scripture_font_size": "Ukubwa wa fonti ya Maandiko",
      "obs_connection": "Muunganisho wa OBS",
      "host": "Mwenyeji",
      "port": "Mlango",
      "password": "Nenosiri",
      "connect": "Unganisha",
      "disconnect": "Tenganisha",
      "hotkeys_dock_focus": "Njia za mkato (dock ikiwa hai)",
      "data_backup": "Data na nakala ya akiba",
      "hymns_services_and_settings_are_stored": "Nyimbo, ratiba na mipangilio huhifadhiwa kwenye kivinjari hiki. Nakala huchukuliwa kiotomatiki kila dock inapofunguliwa, na unaweza kutengua ufutaji wa wimbo au ratiba kwa sekunde chache.",
      "export_backup": "Hamisha nakala ya akiba…",
      "restore_from_file": "Rejesha kutoka kwa faili…",
      "usage_report_each_hymn_put_on": "Ripoti ya matumizi: kila wimbo unaoonyeshwa skrini huandikwa kwenye kifaa hiki (tarehe, kichwa, nambari ya CCLI) ili uweze kuripoti kwa CCLI. Hakuna kinachotumwa popote.",
      "export_usage_report_csv": "Hamisha ripoti ya matumizi (CSV)…",
      "clear_usage_log": "Futa rekodi ya matumizi",
      "automatic_snapshots": "Nakala za kiotomatiki",
      "restore_selected_snapshot": "Rejesha nakala iliyochaguliwa",
      "bibles_are_stored_separately_and_are": "Biblia huhifadhiwa tofauti na haziguswi na nakala ya akiba wala urejeshaji. Maelezo ya muunganisho wa OBS na nenosiri hayaandikwi kamwe kwenye faili ya nakala.",
      "licensing_credits": "Leseni na shukrani",
      "livestreaming": "Matangazo wa moja kwa moja:",
      "showing_copyrighted_lyrics_on_a_livestream": "kuonyesha maneno yenye hakimiliki kwenye matangazo ya moja kwa moja kwa kawaida kunahitaji leseni ya matangazo pamoja na leseni ya kawaida ya hakimiliki ya kanisa (mfano CCLI au OneLicense). Mahitaji hutofautiana kwa nchi na jukwaa — wasiliana na mtoa leseni wako. Nyimbo za umma hazihitaji. Andika hakimiliki na nambari ya CCLI ya kila wimbo kwenye fomu ya kuhariri.",
      "bible_translations": "Tafsiri za Biblia:",
      "you_are_responsible_for_having_the": "unawajibika kuwa na haki ya kutumia tafsiri unazoingiza. Maandishi ya umma au yenye leseni huria ni sawa; mengine yanahitaji ruhusa ya mchapishaji.",
      "ask_for_a_second_press_before": "Omba kubonyeza mara ya pili kabla ya kwenda kipengee kinachofuata cha ibada",
      "copyright": "Hakimiliki",
      "ccli": "Nambari ya CCLI",
      "name_optional": "Jina (si lazima)",
      "search_by_title_author_or_number": "Tafuta kwa kichwa, mwandishi au nambari…",
      "reference_or_label": "Rejeleo au lebo",
      "enter_text": "Andika maandishi…",
      "type_any_text_to_send_to": "Andika maandishi yoyote ya kutuma kwenye skrini (Maandiko, tangazo, skrini tupu...)",
      "leave_blank_if_none": "(acha tupu kama hakuna)",
      "e_g_public_domain_or_1990": "mf., Umma, au © 1990 Mchapishaji",
      "take_the_screen_down_without_losing": "Ondoa skrini bila kupoteza ulipo (B)",
      "bring_back_what_was_on_screen": "Rudisha kilichokuwa skrini kabla ya Tupu / Futa (Z)",
      "keyboard_shortcuts": "Njia za mkato za kibodi (?)",
      "previous_item_in_service": "Kipengee kilichotangulia cha ibada",
      "next_item_in_service": "Kipengee kinachofuata cha ibada",
      "import_a_service_schedule_from_a": "Ingiza ratiba ya ibada kutoka faili ya maandishi",
      "active_translation": "Tafsiri inayotumika",
      "look_up_verse": "Tafuta mstari",
      "skip_the_confidence_preview_planned_scripture": "Ruka onyesho la awali: vifungu vilivyopangwa huenda moja kwa moja kwenye skrini vikiamilishwa",
      "on_the_last_verse_the_first": "Kwenye mstari wa mwisho, kubonyeza Mbele mara ya kwanza kunaandaa tu kusonga; kubonyeza mara ya pili ndani ya sekunde chache huenda kipengee kinachofuata cha ibada",
      "storage_type": "Aina ya hifadhi",
      "main_navigation": "Urambazaji mkuu",
      "keyboard_shortcuts_2": "Njia za mkato za kibodi",
      "filter_by_source": "Chuja kwa chanzo",
      "hymns_library": "Maktaba ya nyimbo",
      "select_hymn_file_to_import": "Chagua faili ya nyimbo ya kuingiza",
      "translation_name_optional_filled_in_automaticall": "Jina la tafsiri (si lazima, hujazwa kiotomatiki)",
      "select_a_bible_file": "Chagua faili ya Biblia",
      "select_service_schedule_text_file": "Chagua faili ya maandishi ya ratiba ya ibada",
      "saved_services": "Ibada zilizohifadhiwa",
      "jump_to_verse": "Ruka hadi mstari",
      "scripture_reference": "Rejeleo la Maandiko",
      "bible_translation": "Tafsiri ya Biblia",
      "verse_text": "Maandishi ya mstari",
      "previous_page": "Ukurasa uliotangulia",
      "next_page": "Ukurasa unaofuata",
      "background_opacity_2": "Uwazi wa mandharinyuma"
    },
    "drop": {
      "overlay": "Dondosha ili kuingiza",
      "unsupported": "Aina hiyo ya faili haiwezi kuingizwa. Tumia faili ya nyimbo (.txt, .csv, .json, .cho, .usr), faili ya Biblia (.zip, .json, .usfm), ratiba ya ibada (.txt) au nakala ya HymnFlow (.json)."
    },
    "msg": {
      "noSnapshots": "Bado hakuna nakala",
      "shortcutsNote": "Njia za mkato hufanya kazi dock ikiwa hai. Kwa funguo zinazofanya kazi kutoka dirisha lolote, unganisha hotkeys za OBS katika Mtindo → Muunganisho wa OBS.",
      "hotkeysOn": "Njia za mkato za jumla: zimewashwa",
      "hotkeysConnecting": "Njia za mkato za jumla: inaunganisha…",
      "hotkeysOff": "Njia za mkato za jumla: zimezimwa",
      "hotkeysConnected": "Hotkeys za OBS zimeunganishwa",
      "storageFullHymns": "Hifadhi imejaa (nyimbo {count}). Hamisha nyimbo zako kisha futa hifadhi ili kuendelea.",
      "storageFull": "Hifadhi imejaa — hamisha nyimbo ili kupata nafasi.",
      "errorSavingHymns": "Hitilafu kuhifadhi nyimbo: {error}",
      "errorSavingSettings": "Hitilafu kuhifadhi mipangilio: {error}",
      "errorSavingServices": "Hitilafu kuhifadhi ibada: {error}",
      "bibleNotLoaded": "Biblia haijapakiwa — ingiza tafsiri kwenye kichupo cha Maktaba",
      "draftRestored": "Rasimu ya ibada isiyohifadhiwa imerejeshwa",
      "listLabel": "Lebo ya orodha: \"{label}\"",
      "cueNotes": "Vidokezo vya ishara — {item}",
      "serviceDeletedShort": "Ibada imefutwa",
      "duplicated": "Imenakiliwa: \"{name}\"",
      "serviceImportEmpty": "Kuingiza kumeshindwa: hakuna vipengee vya ibada kwenye faili",
      "serviceImported": "Imeingizwa \"{name}\" — vipengee {count}{warnings}",
      "warningsCount": "maonyo {count}",
      "serviceImportWarnings": "Ibada imeingizwa ikiwa na maonyo:",
      "couldNotRead": "Imeshindwa kusoma faili",
      "importing": "Inaingiza… ({done}/{total})",
      "importFailed": "Kuingiza kumeshindwa: {error}",
      "kjvLoaded": "KJV imepakiwa — tayari kutafuta Maandiko",
      "noUsage": "Bado hakuna wimbo ulioonyeshwa.",
      "clearUsageConfirm": "Futa rekodi ya matumizi kwenye kifaa hiki? Ihamishe kwanza ukihitaji kuripoti.",
      "clear": "Futa",
      "usageCleared": "Rekodi ya matumizi imefutwa",
      "creditsIntro": "Shukrani za tafsiri ulizopakia (ziorodheshe kwenye shukrani za kanisa lako):",
      "open": "Fungua",
      "copyLink": "Nakili kiungo",
      "linkCopied": "Kiungo kimenakiliwa",
      "copyManually": "Chagua maandishi ya kiungo hapo juu na uyanakili (Ctrl+C)",
      "hotkeysSetupTitle": "Bofya ili kuweka njia za mkato za jumla (Mtindo → Muunganisho wa OBS)"
    },
    "bibleGet": {
      "otherLanguages": "Lugha nyingine",
      "license": {
        "pd": "Umma (public domain)",
        "bibliatodo": "Leseni ya bure (BibliaTodo v1.9) — shukrani zinahitajika",
        "ccbysa": "CC BY-SA 4.0 — toa shukrani kwa Biblica",
        "varies": "Hutofautiana — angalia kila tafsiri"
      },
      "steps": {
        "save": "Hifadhi faili kisha liburute juu ya kadi ya Biblia hapo juu.",
        "zip": "Pakua ZIP ya JSON na uliburute juu ya kadi ya Biblia hapo juu (hakuna haja ya kufungua).",
        "ntbt": "Liburute ZIP uliyopakua juu ya kadi ya Biblia hapo juu (hakuna haja ya kufungua).",
        "yoruba": "Kwenye ukurasa, pakua toleo la USFM (.zip) na uliburute juu ya kadi ya Biblia hapo juu — HymnFlow hulibadilisha kwa ajili yako.",
        "ebible": "Mamia ya tafsiri. Pakua toleo la USFM (.zip) na uliburute juu ya kadi ya Biblia hapo juu."
      }
    },
    "operator": {
      "corruptKept": "Data iliyohifadhiwa ya {name} haikuweza kusomwa. Nakala imehifadhiwa kwenye hifadhi ya kivinjari (hymnflow-corrupt-{name}-*) ili iweze kurejeshwa.",
      "restore": "Rejesha",
      "noSnapshot": "Nakala hiyo haipatikani tena.",
      "notBackup": "Faili hiyo si nakala ya akiba ya HymnFlow.",
      "emptyBackup": "Nakala ya akiba haina nyimbo zinazoweza kutumika.",
      "undo": "Tengua",
      "undone": "Imerejeshwa",
      "nothingToRestore": "Hakuna cha kurejesha",
      "restored": "Kilichokuwa skrini kimerejeshwa",
      "pressAgain": "Mstari wa mwisho — bonyeza Mbele tena kwa {item}",
      "blanked": "Skrini imefifishwa",
      "cleared": "Skrini imefutwa",
      "hymnDeleted": "Imefutwa \"{title}\"",
      "serviceDeleted": "Ibada \"{name}\" imefutwa"
    }
  },
  "tl": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "Lower-third controller para sa OBS HYMN by @gbcowode",
      "status": {
        "live": "LIVE",
        "storage": "localStorage",
        "ready": "Handa ({storage})",
        "hymnUpdated": "Na-update ang himno",
        "hymnAdded": "Naidagdag ang himno"
      },
      "errors": {
        "sendFailed": "Error sa pagpapadala sa overlay: {error}"
      }
    },
    "hymns": {
      "title": "Mga Himno",
      "searchPlaceholder": "Maghanap ng mga himno",
      "searchLabel": "Maghanap ng mga himno sa pamamagitan ng pamagat, may-akda, o numero",
      "noHymnsFound": "Walang nahanap na mga himno",
      "noHymnSelected": "Walang himnong napili",
      "selectedTitle": "Pamagat ng Napiling Himno",
      "buttons": {
        "add": "+ Idagdag",
        "edit": "✏️ I-edit",
        "remove": "- Alisin",
        "import": "I-import",
        "export": "I-export"
      },
      "labels": {
        "hymnNumber": "Numero ng Himno",
        "sourceAbbr": "Abbreviation ng Pinagmulan",
        "sourceName": "Pangalan ng Pinagmulan",
        "title": "Pamagat",
        "author": "May-akda",
        "verses": "Mga Bersikulo",
        "chorus": "Koro",
        "versesSeparator": "(hiwalayin ang mga bersikulo gamit ang blangkong linya)",
        "chorusOptional": "(opsyonal)",
        "required": "*",
        "versesCount": "{count} (na) bersikulo"
      },
      "placeholders": {
        "number": "hal., 123",
        "sourceAbbr": "hal., CH, PD, HB",
        "sourceName": "hal., Church Hymnal, Public Domain",
        "title": "Pamagat ng himno",
        "author": "Pangalan ng may-akda",
        "verses": "Teksto ng Bersikulo 1\n\nTeksto ng Bersikulo 2\n\nTeksto ng Bersikulo 3",
        "chorus": "Teksto ng koro"
      },
      "alerts": {
        "noChorus": "Walang koro para sa himnong ito",
        "noHymnSelected": "Walang himnong napili",
        "noHymnToEdit": "Walang himnong napili na i-e-edit",
        "titleRequired": "Kinakailangan ang pamagat",
        "versesRequired": "Kinakailangan ang kahit isang bersikulo",
        "validationFailed": "Bigo ang pag-validate sa himno:\n{errors}",
        "importFailed": "Bigo ang pag-import: {error}"
      },
      "confirmations": {
        "delete": "I-delete ang \"{title}\"?"
      },
      "status": {
        "exported": "Na-export ang {filename}",
        "imported": "Na-import ang {count} (na) himno{skipped}"
      }
    },
    "services": {
      "title": "Mga Serbisyo",
      "newButton": "+ Bago",
      "namePlaceholder": "Pangalan ng serbisyo (hal., Sunday Morning)",
      "noServicesFound": "Walang nagawang mga serbisyo",
      "noHymnsInService": "Wala pang naidagdag na mga himno",
      "hymnsCount": "{count} (na) himno",
      "buttons": {
        "addHymn": "+ Magdagdag ng Himno",
        "save": "I-save ang Serbisyo",
        "cancel": "Kanselahin",
        "load": "I-load",
        "edit": "I-edit",
        "delete": "I-del"
      },
      "alerts": {
        "nameRequired": "Kinakailangan ang pangalan ng serbisyo",
        "atLeastOneHymn": "Magdagdag ng kahit isang himno sa serbisyo",
        "validationFailed": "Bigo ang pag-validate sa serbisyo:\n{errors}",
        "itemRequired": "Magdagdag ng kahit isang bahagi sa serbisyo"
      },
      "confirmations": {
        "delete": "I-delete ang serbisyong ito?"
      },
      "status": {
        "validationIssues": "Babala: May mga isyu sa pag-validate ang serbisyo",
        "loaded": "Na-load ang serbisyo: {name} ({count} (na) himno)",
        "deleted": "Na-delete ang serbisyo",
        "saved": "Na-save ang serbisyo",
        "hymnNotFound": "Hindi mahanap ang himno sa library",
        "divider": "▸ {label}",
        "hymnDeleted": "Natanggal ang himno ({count} serbisyo ang na-update)"
      },
      "errors": {
        "saveFailed": "Error sa pag-save ng mga serbisyo: {error}"
      },
      "addButtons": {
        "announce": "+ Anunsyo",
        "divider": "+ Divider",
        "hymn": "+ Himno",
        "scripture": "+ Kasulatan"
      },
      "banner": {
        "nextItem": "Susunod na bahagi ng serbisyo",
        "prevItem": "Nakaraang bahagi ng serbisyo"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "Idagdag ang anunsyo",
          "addDivider": "Idagdag ang divider",
          "addScripture": "Idagdag ang Kasulatan",
          "save": "I-save"
        },
        "placeholders": {
          "announceText": "Teksto ng anunsyo (hal., Sumama sa aming pagsasama pagkatapos ng serbisyo)",
          "dividerLabel": "Label ng bahagi (hal., Handog, Sermon, Panalangin)",
          "scriptureRef": "Reperensya (hal., Juan 3:16)",
          "scriptureText": "Teksto ng talata (hal., Sapagkat gayon na lamang ang pag-ibig ng Diyos sa sanlibutan…)"
        },
        "titles": {
          "addAnnounce": "Magdagdag ng anunsyo",
          "addDivider": "Magdagdag ng divider",
          "addScripture": "Magdagdag ng Kasulatan",
          "editAnnounce": "I-edit ang anunsyo",
          "editDivider": "I-edit ang divider",
          "editScripture": "I-edit ang Kasulatan"
        }
      }
    },
    "textSlide": {
      "title": "Slide ng Teksto",
      "hint": "kasulatan, anunsyo, blangkong screen",
      "sendButton": "Ipadala sa Overlay",
      "clearButton": "Burahin ang Slide",
      "sent": "Naipadala ang slide ng teksto",
      "cleared": "Na-clear ang slide ng teksto"
    },
    "bible": {
      "title": "Biblia",
      "label": "Biblia",
      "description": "Mag-import ng JSON file ng anumang salin para i-enable ang paghahanap ng talata. Ang bawat salin ay naka-store nang hiwalay — lumipat sa pagitan nila anumang oras.",
      "importButton": "I-import ang JSON",
      "loading": "Naglo-load ng Biblia…",
      "notLoaded": "Hindi na-load"
    },
    "quickScripture": {
      "title": "Mabilis na Kasulatan",
      "hint": "live · ad-hoc",
      "refPlaceholder": "Sanggunian (hal., Juan 3:16)",
      "textPlaceholder": "Teksto ng talata — blangkong linya ang naghihiwalay ng mga pahina",
      "lookupButton": "🔍",
      "displayButton": "Ipakita",
      "clearButton": "I-clear",
      "status": "Kasulatan: {ref}",
      "statusNoRef": "Ipinapakita ang kasulatan"
    },
    "navigation": {
      "verseInfo": "Bersikulo {current}/{total} · Mga Linya {startLine}-{endLine} ng {totalLines}",
      "buttons": {
        "prevVerse": "⟵ Nakaraan",
        "nextVerse": "Susunod ⟶",
        "prevLine": "⬆ Nakaraang Linya",
        "nextLine": "⬇ Susunod na Linya",
        "jumpChorus": "Pumunta sa Koro",
        "emergencyClear": "Emergency Clear"
      },
      "tooltips": {
        "prevVerse": "Nakaraang bersikulo (Left arrow)",
        "nextVerse": "Susunod na bersikulo (Right arrow)",
        "prevLine": "Nakaraang window ng linya (Up arrow)",
        "nextLine": "Susunod na window ng linya (Down arrow)",
        "jumpChorus": "Ipakita ang koro kung mayroon",
        "emergencyClear": "Agad na itago ang overlay sa stream"
      },
      "chorusNext": " · Susunod ang koro",
      "lastChorus": " · Huling koro",
      "lastVerse": " · Huling talata",
      "shrinksToFit": " · ⚠ lumiliit para magkasya",
      "chorusInfo": "Koro · Mga linya {startLine}-{endLine} ng {totalLines}"
    },
    "display": {
      "title": "Mga Kontrol sa Display",
      "displayLabel": "Display",
      "liveIndicator": "LIVE",
      "resetButton": "I-reset",
      "resetTooltip": "I-reset sa unang bersikulo, unang linya",
      "linesPerDisplay": "Mga linya bawat display",
      "blanked": "Naka-blank ang screen — ibabalik ito ng Display o Quick Scripture",
      "displayOffHint": "NAKA-OFF ang display — i-on ang Display switch para ipakita ang himnong ito",
      "hotkeysReconnecting": "Naputol ang OBS hotkeys — muling kumokonekta…",
      "noHymnSelected": "Walang ipapakita — pumili muna ng himno",
      "offHint": "NAKA-OFF ang display — i-on ang Display switch para ipakita ang himnong ito"
    },
    "preview": {
      "title": "Mga Preview ng Himno"
    },
    "styles": {
      "title": "Mga Estilo",
      "fontFamily": "Font Family",
      "fontSize": "Laki ng font",
      "bold": "Bold",
      "italic": "Italic",
      "shadow": "Shadow",
      "glow": "Glow",
      "outline": "Outline",
      "outlineColor": "Kulay ng Outline",
      "outlineWidth": "Lapad ng Outline",
      "textColor": "Kulay ng Teksto",
      "bgType": "Uri ng background",
      "bgColorA": "Kulay ng background A",
      "bgColorB": "Kulay ng background B (para sa gradient)",
      "animation": "Animation",
      "position": "Posisyon",
      "bgTypes": {
        "transparent": "Transparent",
        "solid": "Solid",
        "gradient": "Gradient"
      },
      "animations": {
        "fade": "Fade",
        "slide": "Slide",
        "none": "Wala"
      },
      "positions": {
        "bottom": "Bottom Third",
        "middle": "Gitna",
        "top": "Itaas"
      }
    },
    "modal": {
      "editHymn": "I-edit ang Himno",
      "addHymn": "Magdagdag ng Himno",
      "buttons": {
        "cancel": "Kanselahin",
        "save": "I-save ang mga Pagbabago",
        "addAnyway": "Idagdag pa rin",
        "delete": "Tanggalin",
        "discard": "Itapon",
        "ok": "OK"
      },
      "confirmations": {
        "badReference": "Mukhang hindi wastong reperensya ng Bibliya ang \"{ref}\".\nIdagdag pa rin?",
        "discard": "Itapon ang mga hindi pa nase-save na pagbabago?"
      }
    },
    "settings": {
      "title": "Mga Setting",
      "language": "Wika",
      "languageLabel": "Wika ng Interface"
    },
    "tabs": {
      "library": "Library",
      "service": "Serbisyo",
      "live": "Live",
      "style": "Estilo"
    },
    "setup": {
      "import": {
        "selectFile": "Piliin ang na-download na .json, .txt, o .csv na file"
      },
      "controls": {
        "exportDesc": "I-save ang mga himno sa hymnflow-export.json"
      },
      "features": {
        "importFormats": "Mag-import ng .txt, .csv, o .json na mga file"
      },
      "importFormats": {
        "csv": "Format ng CSV"
      }
    },
    "ui": {
      "blank_screen": "Blangkong screen",
      "restore": "↩ Ibalik",
      "shortcuts": "? Mga shortcut",
      "tip_drop_any_downloaded_file_anywhere": "Tip: i-drop ang anumang na-download na file kahit saan sa dock — Bibliya (.zip, .json, USFM), mga himno, iskedyul ng serbisyo o backup. Alam ng HymnFlow kung ano ito, ina-unzip at kino-convert para sa iyo.",
      "get_another_translation": "Kumuha ng ibang salin",
      "hymnflow_never_downloads_anything_itself_pick": "Hindi kailanman nagda-download ng anuman ang HymnFlow. Pumili ng wika, buksan ang link, i-save ang file, saka i-drop sa Bible card sa itaas — hindi na kailangang i-unzip o i-convert. Suriin ang lisensya ng bawat salin.",
      "language": "Wika",
      "import": "I-import",
      "cancel": "Kanselahin",
      "auto_display_planned_scripture": "Awtomatikong ipakita ang nakaplanong Kasulatan",
      "background_opacity": "Opacity ng background",
      "scripture_display": "Display ng Kasulatan",
      "scripture_font": "Font ng Kasulatan",
      "classic_serif_default": "Classic Serif (default)",
      "same_as_lyrics": "Kapareho ng liriko",
      "italic_text": "Italic na teksto",
      "show_reference": "Ipakita ang reperensya",
      "translation_badge": "Badge ng salin",
      "custom_size": "Custom na laki",
      "scripture_font_size": "Laki ng font ng Kasulatan",
      "obs_connection": "Koneksyon sa OBS",
      "host": "Host",
      "port": "Port",
      "password": "Password",
      "connect": "Kumonekta",
      "disconnect": "Idiskonekta",
      "hotkeys_dock_focus": "Mga hotkey (nakatutok ang dock)",
      "data_backup": "Data at backup",
      "hymns_services_and_settings_are_stored": "Ang mga himno, serbisyo at setting ay naka-save sa browser na ito. Awtomatikong kumukuha ng snapshot sa tuwing bubuksan ang dock, at maaaring i-undo ang pagtanggal ng himno o serbisyo sa loob ng ilang segundo.",
      "export_backup": "I-export ang backup…",
      "restore_from_file": "Ibalik mula sa file…",
      "usage_report_each_hymn_put_on": "Ulat ng paggamit: ang bawat himnong ipinapakita sa screen ay itinatala sa device na ito (petsa, pamagat, numero ng CCLI) para makapag-ulat ka sa CCLI. Walang ipinapadala kahit saan.",
      "export_usage_report_csv": "I-export ang ulat ng paggamit (CSV)…",
      "clear_usage_log": "I-clear ang log ng paggamit",
      "automatic_snapshots": "Mga awtomatikong snapshot",
      "restore_selected_snapshot": "Ibalik ang napiling snapshot",
      "bibles_are_stored_separately_and_are": "Hiwalay na naka-save ang mga Bibliya at hindi ginagalaw ng backup o restore. Hindi kailanman isinusulat sa backup file ang detalye ng koneksyon sa OBS at password.",
      "licensing_credits": "Lisensya at credits",
      "livestreaming": "Livestreaming:",
      "showing_copyrighted_lyrics_on_a_livestream": "ang pagpapakita ng liriko na may copyright sa livestream ay karaniwang nangangailangan ng streaming license bukod sa karaniwang copyright license ng simbahan (halimbawa CCLI o OneLicense). Magkakaiba ang mga kinakailangan sa bawat bansa at platform — kumonsulta sa iyong provider ng lisensya. Hindi ito kailangan ng mga himnong public domain. Itala ang copyright at numero ng CCLI ng bawat himno sa edit form nito.",
      "bible_translations": "Mga salin ng Bibliya:",
      "you_are_responsible_for_having_the": "ikaw ang responsable na may karapatan kang gamitin ang mga salin na ini-import mo. Ayos ang mga tekstong public domain at may bukas na lisensya; ang iba ay nangangailangan ng pahintulot ng publisher.",
      "ask_for_a_second_press_before": "Humingi ng ikalawang pindot bago lumipat sa susunod na bahagi ng serbisyo",
      "copyright": "Copyright",
      "ccli": "Numero ng CCLI",
      "name_optional": "Pangalan (opsyonal)",
      "search_by_title_author_or_number": "Maghanap ayon sa pamagat, may-akda o numero…",
      "reference_or_label": "Reperensya o label",
      "enter_text": "Maglagay ng teksto…",
      "type_any_text_to_send_to": "Mag-type ng anumang teksto na ipapadala sa overlay (Kasulatan, anunsyo, blangkong screen...)",
      "leave_blank_if_none": "(iwanang blangko kung wala)",
      "e_g_public_domain_or_1990": "hal., Public domain, o © 1990 Publisher",
      "take_the_screen_down_without_losing": "Alisin ang screen nang hindi nawawala ang puwesto (B)",
      "bring_back_what_was_on_screen": "Ibalik ang nasa screen bago ang Blank / Clear (Z)",
      "keyboard_shortcuts": "Mga keyboard shortcut (?)",
      "previous_item_in_service": "Nakaraang bahagi ng serbisyo",
      "next_item_in_service": "Susunod na bahagi ng serbisyo",
      "import_a_service_schedule_from_a": "Mag-import ng iskedyul ng serbisyo mula sa text file",
      "active_translation": "Aktibong salin",
      "look_up_verse": "Hanapin ang talata",
      "skip_the_confidence_preview_planned_scripture": "Laktawan ang confidence preview: dederetso sa overlay ang mga nakaplanong talata kapag na-activate",
      "on_the_last_verse_the_first": "Sa huling talata, ang unang pindot sa Susunod ay naghahanda lamang; ang ikalawang pindot sa loob ng ilang segundo ay lilipat sa susunod na bahagi ng serbisyo",
      "storage_type": "Uri ng storage",
      "main_navigation": "Pangunahing nabigasyon",
      "keyboard_shortcuts_2": "Mga keyboard shortcut",
      "filter_by_source": "I-filter ayon sa pinagmulan",
      "hymns_library": "Aklatan ng mga himno",
      "select_hymn_file_to_import": "Pumili ng file ng himno na ii-import",
      "translation_name_optional_filled_in_automaticall": "Pangalan ng salin (opsyonal, awtomatikong pinupunan)",
      "select_a_bible_file": "Pumili ng file ng Bibliya",
      "select_service_schedule_text_file": "Pumili ng text file ng iskedyul ng serbisyo",
      "saved_services": "Mga naka-save na serbisyo",
      "jump_to_verse": "Lumipat sa talata",
      "scripture_reference": "Reperensya ng Kasulatan",
      "bible_translation": "Salin ng Bibliya",
      "verse_text": "Teksto ng talata",
      "previous_page": "Nakaraang pahina",
      "next_page": "Susunod na pahina",
      "background_opacity_2": "Opacity ng background"
    },
    "drop": {
      "overlay": "I-drop para i-import",
      "unsupported": "Hindi ma-import ang ganitong uri ng file. Gumamit ng file ng himno (.txt, .csv, .json, .cho, .usr), file ng Bibliya (.zip, .json, .usfm), iskedyul ng serbisyo (.txt) o backup ng HymnFlow (.json)."
    },
    "msg": {
      "noSnapshots": "Wala pang snapshot",
      "shortcutsNote": "Gumagana ang mga shortcut habang nakatutok ang dock. Para sa mga key na gumagana sa anumang window, ikonekta ang OBS hotkeys sa Style → OBS Connection.",
      "hotkeysOn": "Mga global hotkey: naka-on",
      "hotkeysConnecting": "Mga global hotkey: kumokonekta…",
      "hotkeysOff": "Mga global hotkey: naka-off",
      "hotkeysConnected": "Nakakonekta ang OBS hotkeys",
      "storageFullHymns": "Puno na ang storage ({count} himno). I-export ang iyong mga himno saka i-clear ang storage para magpatuloy.",
      "storageFull": "Puno ang storage — mag-export ng mga himno para magkaroon ng espasyo.",
      "errorSavingHymns": "Error sa pag-save ng mga himno: {error}",
      "errorSavingSettings": "Error sa pag-save ng mga setting: {error}",
      "errorSavingServices": "Error sa pag-save ng mga serbisyo: {error}",
      "bibleNotLoaded": "Hindi pa naka-load ang Bibliya — mag-import ng salin sa tab na Library",
      "draftRestored": "Naibalik ang hindi pa nase-save na draft ng serbisyo",
      "listLabel": "Label sa listahan: \"{label}\"",
      "cueNotes": "Mga cue note — {item}",
      "serviceDeletedShort": "Natanggal ang serbisyo",
      "duplicated": "Na-duplicate: \"{name}\"",
      "serviceImportEmpty": "Nabigo ang pag-import: walang nakitang bahagi ng serbisyo sa file",
      "serviceImported": "Na-import ang \"{name}\" — {count} bahagi{warnings}",
      "warningsCount": "{count} babala",
      "serviceImportWarnings": "Na-import ang serbisyo na may mga babala:",
      "couldNotRead": "Hindi mabasa ang file",
      "importing": "Nag-i-import… ({done}/{total})",
      "importFailed": "Nabigo ang pag-import: {error}",
      "kjvLoaded": "Na-load ang KJV — handa na para sa paghahanap ng talata",
      "noUsage": "Wala pang himnong naipakita.",
      "clearUsageConfirm": "I-clear ang log ng paggamit sa device na ito? I-export muna ito kung kailangan mo para sa pag-uulat.",
      "clear": "I-clear",
      "usageCleared": "Na-clear ang log ng paggamit",
      "creditsIntro": "Mga credit para sa mga salin na na-load mo (ilista ito sa mga credit ng iyong simbahan):",
      "open": "Buksan",
      "copyLink": "Kopyahin ang link",
      "linkCopied": "Nakopya ang link",
      "copyManually": "Piliin ang teksto ng link sa itaas at kopyahin ito (Ctrl+C)",
      "hotkeysSetupTitle": "I-click para i-set up ang mga global hotkey (Style → OBS Connection)"
    },
    "bibleGet": {
      "otherLanguages": "Iba pang wika",
      "license": {
        "pd": "Public domain",
        "bibliatodo": "Libreng lisensya (BibliaTodo v1.9) — kailangan ang credit",
        "ccbysa": "CC BY-SA 4.0 — i-credit ang Biblica",
        "varies": "Nag-iiba — suriin ang bawat salin"
      },
      "steps": {
        "save": "I-save ang file, saka i-drop sa Bible card sa itaas.",
        "zip": "I-download ang JSON ZIP at i-drop sa Bible card sa itaas (hindi na kailangang i-unzip).",
        "ntbt": "I-drop ang na-download na ZIP sa Bible card sa itaas (hindi na kailangang i-unzip).",
        "yoruba": "Sa pahina, i-download ang USFM (.zip) na bersyon at i-drop sa Bible card sa itaas — kino-convert ito ng HymnFlow para sa iyo.",
        "ebible": "Daan-daang salin. I-download ang USFM (.zip) na bersyon at i-drop sa Bible card sa itaas."
      }
    },
    "operator": {
      "corruptKept": "Hindi mabasa ang naka-save na data ng {name}. May kopyang itinabi sa storage ng browser (hymnflow-corrupt-{name}-*) para mabawi.",
      "restore": "Ibalik",
      "noSnapshot": "Hindi na available ang snapshot na iyon.",
      "notBackup": "Hindi backup ng HymnFlow ang file na iyon.",
      "emptyBackup": "Walang magagamit na himno sa backup.",
      "undo": "I-undo",
      "undone": "Naibalik",
      "nothingToRestore": "Walang maibabalik",
      "restored": "Naibalik ang dating nasa screen",
      "pressAgain": "Huling talata — pindutin muli ang Susunod para sa {item}",
      "blanked": "Naka-blank ang screen",
      "cleared": "Na-clear ang screen",
      "hymnDeleted": "Tinanggal ang \"{title}\"",
      "serviceDeleted": "Tinanggal ang serbisyong \"{name}\""
    }
  },
  "yo": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "Atunṣe isalẹ-kẹta fun OBS HYMN by @gbcowode",
      "status": {
        "live": "LÓRÍ ATFẸFERẸ",
        "storage": "localStorage",
        "ready": "Ti ṣetán ({storage})",
        "hymnUpdated": "Orin ti wa ni imulọdu",
        "hymnAdded": "A ti fi orin kún un"
      },
      "errors": {
        "sendFailed": "Àṣìṣe nígbà tí a ń ránṣẹ́ sí overlay: {error}"
      }
    },
    "hymns": {
      "title": "Àwọn Orin",
      "searchPlaceholder": "Wá àwọn orin",
      "searchLabel": "Wá àwọn orin nípa àkòrí, òǹkọ̀wé, tàbí nọ́ńbà",
      "noHymnsFound": "A kò rí orin kankan",
      "noHymnSelected": "A kò yan orin kankan",
      "selectedTitle": "Àkòrí Orin tí A Yan",
      "buttons": {
        "add": "+ Fi kún un",
        "edit": "✏️ Àtúnṣe",
        "remove": "- Yọ kúrò",
        "import": "Kó wọlé",
        "export": "Kó jáde"
      },
      "labels": {
        "hymnNumber": "Nọ́ńbà Orin",
        "sourceAbbr": "Ìkékúrú Orísun",
        "sourceName": "Orúkọ Orísun",
        "title": "Àkòrí",
        "author": "Òǹkọ̀wé",
        "verses": "Àwọn Ẹsẹ",
        "chorus": "Ègbè",
        "versesSeparator": "(ya àwọn ẹsẹ sọ́tọ̀ pẹ̀lú ilà tí kò ní nǹkan)",
        "chorusOptional": "(iyanfẹ́)",
        "required": "*",
        "versesCount": "Ẹsẹ {count}"
      },
      "placeholders": {
        "number": "bí àpẹẹrẹ, 123",
        "sourceAbbr": "bí àpẹẹrẹ, CH, PD, HB",
        "sourceName": "bí àpẹẹrẹ, Church Hymnal, Public Domain",
        "title": "Àkòrí orin",
        "author": "Orúkọ òǹkọ̀wé",
        "verses": "Ìsọfúnnì ẹsẹ kìn-ín-ní\n\nÌsọfúnnì ẹsẹ kejì\n\nÌsọfúnnì ẹsẹ kẹta",
        "chorus": "Ìsọfúnnì ègbè"
      },
      "alerts": {
        "noChorus": "Kò sí ègbè fún orin yìí",
        "noHymnSelected": "A kò yan orin kankan",
        "noHymnToEdit": "A kò yan orin kankan láti ṣatúnṣe",
        "titleRequired": "Àkòrí ṣe pàtàkì",
        "versesRequired": "Ó kéré tán, ẹsẹ kan gbọ́dọ̀ wà",
        "validationFailed": "Ìfihàn orin kùnà:\n{errors}",
        "importFailed": "Kíkó wọlé kùnà: {error}"
      },
      "confirmations": {
        "delete": "Pa \"{title}\" rẹ́?"
      },
      "status": {
        "exported": "A ti kó {filename} jáde",
        "imported": "A ti kó orin {count} wọlé{skipped}"
      }
    },
    "services": {
      "title": "Àwọn Ìsìn",
      "newButton": "+ Tuntun",
      "namePlaceholder": "Orúkọ ìsìn (bí àpẹẹrẹ, Ìsìn Òwúrọ̀ Ọjọ́ Àìkú)",
      "noServicesFound": "A kò tíì dá ìsìn kankan sílẹ̀",
      "noHymnsInService": "A kò tíì fi orin kankan kún ìsìn yìí",
      "hymnsCount": "Orin {count}",
      "buttons": {
        "addHymn": "+ Fi Orin Kún Un",
        "save": "Fi Ìsìn Pa Mọ́",
        "cancel": "Fagilé",
        "load": "Gbé jáde",
        "edit": "Àtúnṣe",
        "delete": "Pa rẹ́"
      },
      "alerts": {
        "nameRequired": "Orúkọ ìsìn ṣe pàtàkì",
        "atLeastOneHymn": "Fi ó kéré tán orin kan kún ìsìn yìí",
        "validationFailed": "Ìfihàn ìsìn kùnà:\n{errors}",
        "itemRequired": "Fi o kéré jù ohun kan kún ètò ìsìn"
      },
      "confirmations": {
        "delete": "Pa ìsìn yìí rẹ́?"
      },
      "status": {
        "validationIssues": "Ìkìlọ̀: Ìsìn yìí ní àwọn ìṣòro ìfihàn",
        "loaded": "Ìsìn tí a gbé jáde: {name} (orin {count})",
        "deleted": "A ti pa ìsìn rẹ́",
        "saved": "A ti fi ìsìn pa mọ́",
        "hymnNotFound": "A kò rí orin náà nínú ìkójọpọ̀",
        "divider": "▸ {label}",
        "hymnDeleted": "A ti pa orin ìyìn rẹ́ (a ṣe ìmúdójúìwọ̀n ètò ìsìn {count})"
      },
      "errors": {
        "saveFailed": "Àṣìṣe nígbà tí a ń fi ìsìn pa mọ́: {error}"
      },
      "addButtons": {
        "announce": "+ Ìkéde",
        "divider": "+ Ìpín",
        "hymn": "+ Orin ìyìn",
        "scripture": "+ Ìwé Mímọ́"
      },
      "banner": {
        "nextItem": "Ohun tó kàn nínú ètò ìsìn",
        "prevItem": "Ohun tó ṣáájú nínú ètò ìsìn"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "Fi ìkéde kún un",
          "addDivider": "Fi ìpín kún un",
          "addScripture": "Fi Ìwé Mímọ́ kún un",
          "save": "Fi pamọ́"
        },
        "placeholders": {
          "announceText": "Ọ̀rọ̀ ìkéde (fún àpẹẹrẹ, Ẹ wá bá wa ṣe ìdàpọ̀ lẹ́yìn ìsìn)",
          "dividerLabel": "Àmì apá (fún àpẹẹrẹ, Ọrẹ, Ìwàásù, Àdúrà)",
          "scriptureRef": "Àlàyé ẹsẹ (fún àpẹẹrẹ, Jòhánù 3:16)",
          "scriptureText": "Ọ̀rọ̀ ẹsẹ (fún àpẹẹrẹ, Nítorí Ọlọ́run fẹ́ aráyé tó bẹ́ẹ̀…)"
        },
        "titles": {
          "addAnnounce": "Fi ìkéde kún un",
          "addDivider": "Fi ìpín kún un",
          "addScripture": "Fi Ìwé Mímọ́ kún un",
          "editAnnounce": "Ṣàtúnṣe ìkéde",
          "editDivider": "Ṣàtúnṣe ìpín",
          "editScripture": "Ṣàtúnṣe Ìwé Mímọ́"
        }
      }
    },
    "textSlide": {
      "title": "Ìfáwọlé Ọ̀rọ̀",
      "hint": "ìwé mímọ́, ìkéde, ojú-ìwé òfo",
      "sendButton": "Fi ránṣẹ sí Overlay",
      "clearButton": "Mọ́ Ìfáwọlé",
      "sent": "A ti fi ìfáwọlé ọ̀rọ̀ ránṣẹ",
      "cleared": "A ti mọ́ ìfáwọlé ọ̀rọ̀"
    },
    "bible": {
      "title": "Bibeli",
      "label": "Bibeli",
      "description": "Gbe faili JSON ti ìtúmọ̀ kankan wá láti ṣe imuṣiṣẹ wiwa ẹsẹ. Ìtúmọ̀ kọ̀ọ̀kan wà ní àárọ̀ — yí padà láàrin wọn nígbàkigbà.",
      "importButton": "Gbe JSON Wọlé",
      "loading": "Ń gbé Bibeli…",
      "notLoaded": "A kò gbé wọlé"
    },
    "quickScripture": {
      "title": "Ìwé Mímọ́ Yára",
      "hint": "láàárọ̀ · ad-hoc",
      "refPlaceholder": "Ìtọ́kasí (fún àpẹẹrẹ, Johanu 3:16)",
      "textPlaceholder": "Ọ̀rọ̀ ẹsẹ — ìlà òfo ṣe ìyàtọ̀ àwọn ojú-ìwé",
      "lookupButton": "🔍",
      "displayButton": "Fihàn",
      "clearButton": "Pa Rẹ",
      "status": "Ìwé Mímọ́: {ref}",
      "statusNoRef": "A ti fihàn Ìwé Mímọ́"
    },
    "navigation": {
      "verseInfo": "Ẹsẹ {current}/{total} · Ìlà {startLine}-{endLine} nínú {totalLines}",
      "chorusInfo": "Ègbè · Ìlà {startLine}-{endLine} nínú {totalLines}",
      "buttons": {
        "prevVerse": "⟵ Èyí tí ó kọjá",
        "nextVerse": "Èyí tí ó kàn ⟶",
        "prevLine": "⬆ Ìlà tí ó kọjá",
        "nextLine": "⬇ Ìlà tí ó kàn",
        "jumpChorus": "Lọ sí Ègbè",
        "emergencyClear": "Pa á rẹ́ fún ìkánjú"
      },
      "tooltips": {
        "prevVerse": "Ẹsẹ tí ó kọjá (Ọfà òsì)",
        "nextVerse": "Ẹsẹ tí ó kàn (Ọfà ọ̀tún)",
        "prevLine": "Ferese ìlà tí ó kọjá (Ọfà òkè)",
        "nextLine": "Ferese ìlà tí ó kàn (Ọfà ìsàlẹ̀)",
        "jumpChorus": "Fi ègbè hàn bí ó bá wà",
        "emergencyClear": "Fi ìbòrí pa mọ́ lẹ́sẹ̀kẹsẹ̀ kúrò lórí afẹ́fẹ́"
      },
      "chorusNext": " · Ègbè tó kàn",
      "lastChorus": " · Ègbè ìkẹyìn",
      "lastVerse": " · Ẹsẹ ìkẹyìn",
      "shrinksToFit": " · ⚠ ń dín kù láti wọ̀"
    },
    "display": {
      "title": "Àwọn Ìṣàkóso Ìfihàn",
      "displayLabel": "Ìfihàn",
      "liveIndicator": "LÓRÍ ATFẸFERẸ",
      "resetButton": "Tunṣe",
      "resetTooltip": "Tunṣe sí ẹsẹ àkọ́kọ́, ìlà àkọ́kọ́",
      "linesPerDisplay": "Ìlà fún ìfihàn kọ̀ọ̀kan",
      "blanked": "A ti sọ ojú-ìbòjú di òfo — Ìfihàn tàbí Ìwé Mímọ́ kíákíá yóò mú un padà",
      "displayOffHint": "Ìfihàn wà ní PÍPA — yí ìyípadà Ìfihàn kí orin yìí lè hàn",
      "hotkeysReconnecting": "Àwọn hotkey OBS ti já — ń tún sopọ̀…",
      "noHymnSelected": "Kò sí ohun láti fihàn — yan orin ìyìn kan ná",
      "offHint": "Ìfihàn wà ní PÍPA — yí ìyípadà Ìfihàn kí orin yìí lè hàn"
    },
    "preview": {
      "title": "Ìwòràn Orin"
    },
    "styles": {
      "title": "Àwọn Irúfẹ́",
      "fontFamily": "Irúfẹ́ Lẹ́tà",
      "fontSize": "Ìtóbi Lẹ́tà",
      "bold": "Ki lẹ́tà",
      "italic": "Sọ̀ lẹ́tà",
      "shadow": "Òjìji",
      "glow": "Ìtànṣán",
      "outline": "Ìlà-etí",
      "outlineColor": "Àwọ̀ Ìlà-etí",
      "outlineWidth": "Ìbú Ìlà-etí",
      "textColor": "Àwọ̀ Lẹ́tà",
      "bgType": "Irúfẹ́ Ìpìlẹ̀",
      "bgColorA": "Àwọ̀ Ìpìlẹ̀ A",
      "bgColorB": "Àwọ̀ Ìpìlẹ̀ B (fún gradient)",
      "animation": "Ìṣípòpàdà",
      "position": "Ipò",
      "bgTypes": {
        "transparent": "Fínnífínní",
        "solid": "Gidi",
        "gradient": "Dàpọ̀"
      },
      "animations": {
        "fade": "Rora parẹ́",
        "slide": "Yọ̀",
        "none": "Kò sí"
      },
      "positions": {
        "bottom": "Isalẹ Kẹta",
        "middle": "Agbedeméjì",
        "top": "Òkè"
      }
    },
    "modal": {
      "editHymn": "Àtúnṣe Orin",
      "addHymn": "Fi Orin Kún Un",
      "buttons": {
        "cancel": "Fagilé",
        "save": "Fi Àtúnṣe Pa Mọ́",
        "addAnyway": "Fi kún un lọ́nàkọnà",
        "delete": "Parẹ́",
        "discard": "Ṣá tì",
        "ok": "Ó dára"
      },
      "confirmations": {
        "badReference": "\"{ref}\" kò jọ àlàyé ẹsẹ Bíbélì tó tọ́.\nṢé kí a fi kún un lọ́nàkọnà?",
        "discard": "Ṣé kí a ṣá àwọn àyípadà tí a kò tíì fi pamọ́ tì?"
      }
    },
    "settings": {
      "title": "Àwọn Ètò",
      "language": "Èdè",
      "languageLabel": "Èdè Ìkọ́nilọ́wọ́"
    },
    "tabs": {
      "library": "Ìkójọpọ̀",
      "service": "Ìsìn",
      "live": "Alãáyẹ",
      "style": "Ìpele"
    },
    "setup": {
      "import": {
        "selectFile": "Yan faili .json, .txt, tabi .csv ti o gba"
      },
      "controls": {
        "exportDesc": "Fi awon orin pamọ si hymnflow-export.json"
      },
      "features": {
        "importFormats": "Gbe faili .txt, .csv, tabi .json wole"
      },
      "importFormats": {
        "csv": "Iru CSV"
      }
    },
    "ui": {
      "blank_screen": "Ṣe ojú-ìbòjú di òfo",
      "restore": "↩ Dá padà",
      "shortcuts": "? Àwọn ọ̀nà àbùjá",
      "tip_drop_any_downloaded_file_anywhere": "Ìmọ̀ràn: sọ fáìlì èyíkéyìí tí o gbà sílẹ̀ sí ibikíbi lórí dock — Bíbélì (.zip, .json, USFM), orin ìyìn, ètò ìsìn tàbí ẹ̀dà ìpamọ́. HymnFlow yóò mọ ohun tí ó jẹ́, yóò ṣí i, yóò sì yí i padà fún ọ.",
      "get_another_translation": "Gba ìtumọ̀ mìíràn",
      "hymnflow_never_downloads_anything_itself_pick": "HymnFlow kì í gba nǹkan kan sílẹ̀ fúnrarẹ̀. Yan èdè kan, ṣí ìjápọ̀ náà, fi fáìlì pamọ́, lẹ́yìn náà sọ ọ́ sórí káàdì Bíbélì lókè — kò sí ìdí láti ṣí tàbí yípadà. Ṣàyẹ̀wò ìwé-àṣẹ ìtumọ̀ kọ̀ọ̀kan.",
      "language": "Èdè",
      "import": "Gbé wọlé",
      "cancel": "Fagilé",
      "auto_display_planned_scripture": "Fi Ìwé Mímọ́ tí a ṣètò hàn fúnrarẹ̀",
      "background_opacity": "Ìṣípayá ẹ̀yìn",
      "scripture_display": "Ìfihàn Ìwé Mímọ́",
      "scripture_font": "Ọ̀nà kíkọ Ìwé Mímọ́",
      "classic_serif_default": "Serif àtijọ́ (àìyípadà)",
      "same_as_lyrics": "Bí ọ̀rọ̀ orin",
      "italic_text": "Ọ̀rọ̀ tí ó tẹ̀",
      "show_reference": "Fi àlàyé ẹsẹ hàn",
      "translation_badge": "Àmì ìtumọ̀",
      "custom_size": "Ìwọ̀n àdáni",
      "scripture_font_size": "Ìwọ̀n kíkọ Ìwé Mímọ́",
      "obs_connection": "Ìsopọ̀ OBS",
      "host": "Olùgbàlejò",
      "port": "Ibudo",
      "password": "Ọ̀rọ̀ ìgbaniwọlé",
      "connect": "Sopọ̀",
      "disconnect": "Ya kúrò",
      "hotkeys_dock_focus": "Àwọn ọ̀nà àbùjá (nígbà tí dock bá wà lórí)",
      "data_backup": "Dátà àti ẹ̀dà ìpamọ́",
      "hymns_services_and_settings_are_stored": "A fi àwọn orin ìyìn, ètò ìsìn àti ètò sí ibi ìwádìí yìí. A máa ń ya àwòrán ìpamọ́ ní gbogbo ìgbà tí a bá ṣí dock, o sì lè dá ìparẹ́ orin tàbí ètò padà fún ìṣẹ́jú-àáyá díẹ̀.",
      "export_backup": "Gbé ẹ̀dà ìpamọ́ jáde…",
      "restore_from_file": "Dá padà láti inú fáìlì…",
      "usage_report_each_hymn_put_on": "Ìròyìn lílò: orin ìyìn kọ̀ọ̀kan tí a fihàn lórí ojú-ìbòjú ni a ń kọ sílẹ̀ lórí ẹ̀rọ yìí (ọjọ́, àkọ́lé, nọ́mbà CCLI) kí o lè fi ròyìn sí CCLI. A kò fi nǹkan ránṣẹ́ sí ibikíbi.",
      "export_usage_report_csv": "Gbé ìròyìn lílò jáde (CSV)…",
      "clear_usage_log": "Pa àkọsílẹ̀ lílò rẹ́",
      "automatic_snapshots": "Àwọn àwòrán ìpamọ́ àdáṣe",
      "restore_selected_snapshot": "Dá àwòrán ìpamọ́ tí a yàn padà",
      "bibles_are_stored_separately_and_are": "A ń pa àwọn Bíbélì mọ́ lọ́tọ̀ọ̀tọ̀, ẹ̀dà ìpamọ́ tàbí ìdápadà kò sì fọwọ́ kàn wọ́n. A kì í kọ àlàyé ìsopọ̀ OBS àti ọ̀rọ̀ ìgbaniwọlé sínú fáìlì ẹ̀dà ìpamọ́.",
      "licensing_credits": "Ìwé-àṣẹ àti ìdúpẹ́",
      "livestreaming": "Ìgbóhùnsáfẹ́fẹ́ láàyè:",
      "showing_copyrighted_lyrics_on_a_livestream": "fífi ọ̀rọ̀ orin tí ó ní ẹ̀tọ́-àdáwòkọ hàn lórí ìgbóhùnsáfẹ́fẹ́ láàyè sábà máa ń béèrè ìwé-àṣẹ ìgbóhùnsáfẹ́fẹ́ yàtọ̀ sí ìwé-àṣẹ ẹ̀tọ́-àdáwòkọ ìjọ (fún àpẹẹrẹ CCLI tàbí OneLicense). Àwọn ohun tí a nílò yàtọ̀ láti orílẹ̀-èdè sí orílẹ̀-èdè àti pẹpẹ — bá olùpèsè ìwé-àṣẹ rẹ sọ̀rọ̀. Àwọn orin ìyìn tí ó jẹ́ ti gbogbo ènìyàn kò nílò rẹ̀. Kọ ẹ̀tọ́-àdáwòkọ àti nọ́mbà CCLI orin kọ̀ọ̀kan sínú fọ́ọ̀mù àtúnṣe rẹ̀.",
      "bible_translations": "Àwọn ìtumọ̀ Bíbélì:",
      "you_are_responsible_for_having_the": "ojúṣe rẹ ni láti ní ẹ̀tọ́ láti lo àwọn ìtumọ̀ tí o gbé wọlé. Àwọn ọ̀rọ̀ tí ó jẹ́ ti gbogbo ènìyàn tàbí tí a fún ní ìwé-àṣẹ ṣíṣí dára; àwọn yòókù nílò ìyọ̀nda láti ọ̀dọ̀ olùtẹ̀wé.",
      "ask_for_a_second_press_before": "Béèrè ìtẹ̀ kejì kí a tó lọ sí ohun tó kàn nínú ètò ìsìn",
      "copyright": "Ẹ̀tọ́-àdáwòkọ",
      "ccli": "Nọ́mbà CCLI",
      "name_optional": "Orúkọ (kò pọn dandan)",
      "search_by_title_author_or_number": "Wá nípa àkọ́lé, òǹkọ̀wé tàbí nọ́mbà…",
      "reference_or_label": "Àlàyé ẹsẹ tàbí àmì",
      "enter_text": "Tẹ ọ̀rọ̀ sí i…",
      "type_any_text_to_send_to": "Tẹ ọ̀rọ̀ èyíkéyìí láti fi ránṣẹ́ sí ojú-ìbòjú (Ìwé Mímọ́, ìkéde, ojú-ìbòjú òfo...)",
      "leave_blank_if_none": "(fi sílẹ̀ bí kò bá sí)",
      "e_g_public_domain_or_1990": "fún àpẹẹrẹ, Ti gbogbo ènìyàn, tàbí © 1990 Olùtẹ̀wé",
      "take_the_screen_down_without_losing": "Mú ojú-ìbòjú kúrò láì sọ ibi tí o dé nù (B)",
      "bring_back_what_was_on_screen": "Mú ohun tó wà lórí ojú-ìbòjú padà kí Òfo / Pa rẹ́ tó ṣẹlẹ̀ (Z)",
      "keyboard_shortcuts": "Àwọn ọ̀nà àbùjá kọ́kọ́rọ́ (?)",
      "previous_item_in_service": "Ohun tó ṣáájú nínú ètò ìsìn",
      "next_item_in_service": "Ohun tó kàn nínú ètò ìsìn",
      "import_a_service_schedule_from_a": "Gbé ètò ìsìn wọlé láti inú fáìlì ọ̀rọ̀",
      "active_translation": "Ìtumọ̀ tí ń lò lọ́wọ́",
      "look_up_verse": "Wá ẹsẹ",
      "skip_the_confidence_preview_planned_scripture": "Yẹ àyẹ̀wò àkọ́kọ́ sílẹ̀: àwọn ẹsẹ tí a ṣètò yóò lọ tààrà sí ojú-ìbòjú nígbà tí a bá mú wọn ṣiṣẹ́",
      "on_the_last_verse_the_first": "Ní ẹsẹ ìkẹyìn, ìtẹ̀ àkọ́kọ́ lórí Èyí tó kàn kàn ń múra sílẹ̀ ni; ìtẹ̀ kejì láàárín ìṣẹ́jú-àáyá díẹ̀ yóò lọ sí ohun tó kàn nínú ètò ìsìn",
      "storage_type": "Irú ibi ìpamọ́",
      "main_navigation": "Ìlọ-bọ̀ pàtàkì",
      "keyboard_shortcuts_2": "Àwọn ọ̀nà àbùjá kọ́kọ́rọ́",
      "filter_by_source": "Ṣẹ̀ka nípa orísun",
      "hymns_library": "Ibi ìkówèé orin ìyìn",
      "select_hymn_file_to_import": "Yan fáìlì orin ìyìn láti gbé wọlé",
      "translation_name_optional_filled_in_automaticall": "Orúkọ ìtumọ̀ (kò pọn dandan, a máa fi sí i fúnrarẹ̀)",
      "select_a_bible_file": "Yan fáìlì Bíbélì kan",
      "select_service_schedule_text_file": "Yan fáìlì ọ̀rọ̀ ètò ìsìn",
      "saved_services": "Àwọn ètò ìsìn tí a fi pamọ́",
      "jump_to_verse": "Lọ sí ẹsẹ",
      "scripture_reference": "Àlàyé ẹsẹ Ìwé Mímọ́",
      "bible_translation": "Ìtumọ̀ Bíbélì",
      "verse_text": "Ọ̀rọ̀ ẹsẹ",
      "previous_page": "Ojú ìwé tó ṣáájú",
      "next_page": "Ojú ìwé tó kàn",
      "background_opacity_2": "Ìṣípayá ẹ̀yìn"
    },
    "drop": {
      "overlay": "Sọ sílẹ̀ láti gbé wọlé",
      "unsupported": "A kò lè gbé irú fáìlì yẹn wọlé. Lo fáìlì orin ìyìn (.txt, .csv, .json, .cho, .usr), fáìlì Bíbélì (.zip, .json, .usfm), ètò ìsìn (.txt) tàbí ẹ̀dà ìpamọ́ HymnFlow (.json)."
    },
    "msg": {
      "noSnapshots": "Kò tíì sí àwòrán ìpamọ́",
      "shortcutsNote": "Àwọn ọ̀nà àbùjá ń ṣiṣẹ́ nígbà tí dock bá wà lórí. Fún àwọn kọ́kọ́rọ́ tí ń ṣiṣẹ́ láti inú fèrèsé èyíkéyìí, so àwọn hotkey OBS ní Ìrísí → Ìsopọ̀ OBS.",
      "hotkeysOn": "Àwọn hotkey gbogbogbò: wà lórí",
      "hotkeysConnecting": "Àwọn hotkey gbogbogbò: ń sopọ̀…",
      "hotkeysOff": "Àwọn hotkey gbogbogbò: wà ní pípa",
      "hotkeysConnected": "A ti so àwọn hotkey OBS",
      "storageFullHymns": "Ibi ìpamọ́ ti kún ({count} orin ìyìn). Gbé àwọn orin rẹ jáde, lẹ́yìn náà ṣí ibi ìpamọ́ kí o lè tẹ̀síwájú.",
      "storageFull": "Ibi ìpamọ́ ti kún — gbé orin ìyìn jáde láti rí ààyè.",
      "errorSavingHymns": "Àṣìṣe nígbà tí a ń fi orin ìyìn pamọ́: {error}",
      "errorSavingSettings": "Àṣìṣe nígbà tí a ń fi ètò pamọ́: {error}",
      "errorSavingServices": "Àṣìṣe nígbà tí a ń fi ètò ìsìn pamọ́: {error}",
      "bibleNotLoaded": "Kò tíì gbé Bíbélì wọlé — gbé ìtumọ̀ kan wọlé ní táàbù Ibi ìkówèé",
      "draftRestored": "A ti dá àkọsílẹ̀ ètò ìsìn tí a kò tíì fi pamọ́ padà",
      "listLabel": "Àmì àtòkọ: \"{label}\"",
      "cueNotes": "Àkọsílẹ̀ ìtọ́kasí — {item}",
      "serviceDeletedShort": "A ti pa ètò ìsìn rẹ́",
      "duplicated": "A ti ṣe ẹ̀dà: \"{name}\"",
      "serviceImportEmpty": "Ìgbéwọlé kùnà: kò sí ohun ètò ìsìn nínú fáìlì náà",
      "serviceImported": "A ti gbé \"{name}\" wọlé — ohun {count}{warnings}",
      "warningsCount": "ìkìlọ̀ {count}",
      "serviceImportWarnings": "A gbé ètò ìsìn wọlé pẹ̀lú ìkìlọ̀:",
      "couldNotRead": "Kò lè ka fáìlì náà",
      "importing": "Ń gbé wọlé… ({done}/{total})",
      "importFailed": "Ìgbéwọlé kùnà: {error}",
      "kjvLoaded": "KJV ti wọlé — ó ṣetán fún wíwá ẹsẹ",
      "noUsage": "A kò tíì fi orin ìyìn kankan hàn.",
      "clearUsageConfirm": "Ṣé kí a pa àkọsílẹ̀ lílò rẹ́ lórí ẹ̀rọ yìí? Gbé e jáde ná tí o bá nílò rẹ̀ fún ìròyìn.",
      "clear": "Pa rẹ́",
      "usageCleared": "A ti pa àkọsílẹ̀ lílò rẹ́",
      "creditsIntro": "Ìdúpẹ́ fún àwọn ìtumọ̀ tí o ti gbé wọlé (kọ wọ́n sínú ìdúpẹ́ ìjọ rẹ):",
      "open": "Ṣí",
      "copyLink": "Ṣe ẹ̀dà ìjápọ̀",
      "linkCopied": "A ti ṣe ẹ̀dà ìjápọ̀",
      "copyManually": "Yan ọ̀rọ̀ ìjápọ̀ lókè kí o sì ṣe ẹ̀dà rẹ̀ (Ctrl+C)",
      "hotkeysSetupTitle": "Tẹ láti ṣètò àwọn hotkey gbogbogbò (Ìrísí → Ìsopọ̀ OBS)"
    },
    "bibleGet": {
      "otherLanguages": "Àwọn èdè mìíràn",
      "license": {
        "pd": "Ti gbogbo ènìyàn",
        "bibliatodo": "Ìwé-àṣẹ ọ̀fẹ́ (BibliaTodo v1.9) — a nílò ìdúpẹ́",
        "ccbysa": "CC BY-SA 4.0 — dúpẹ́ lọ́wọ́ Biblica",
        "varies": "Ó yàtọ̀ — ṣàyẹ̀wò ìtumọ̀ kọ̀ọ̀kan"
      },
      "steps": {
        "save": "Fi fáìlì pamọ́, lẹ́yìn náà sọ ọ́ sórí káàdì Bíbélì lókè.",
        "zip": "Gba ZIP JSON sílẹ̀ kí o sì sọ ọ́ sórí káàdì Bíbélì lókè (kò sí ìdí láti ṣí i).",
        "ntbt": "Sọ ZIP tí o gbà sílẹ̀ sórí káàdì Bíbélì lókè (kò sí ìdí láti ṣí i).",
        "yoruba": "Lórí ojú ìwé náà, gba ẹ̀yà USFM (.zip) sílẹ̀ kí o sì sọ ọ́ sórí káàdì Bíbélì lókè — HymnFlow yóò yí i padà fún ọ.",
        "ebible": "Ọgọ́rọ̀ọ̀rún ìtumọ̀. Gba ẹ̀yà USFM (.zip) sílẹ̀ kí o sì sọ ọ́ sórí káàdì Bíbélì lókè."
      }
    },
    "operator": {
      "corruptKept": "A kò lè ka dátà {name} tí a fi pamọ́. A fi ẹ̀dà kan sílẹ̀ sí ibi ìpamọ́ aṣàwákiri (hymnflow-corrupt-{name}-*) kí a lè gbà á padà.",
      "restore": "Dá padà",
      "noSnapshot": "Àwòrán ìpamọ́ yẹn kò sí mọ́.",
      "notBackup": "Fáìlì yẹn kì í ṣe ẹ̀dà ìpamọ́ HymnFlow.",
      "emptyBackup": "Kò sí orin ìyìn tí a lè lò nínú ẹ̀dà ìpamọ́ náà.",
      "undo": "Dá padà",
      "undone": "A ti dá padà",
      "nothingToRestore": "Kò sí ohun láti dá padà",
      "restored": "A ti dá ohun tó wà lórí ojú-ìbòjú padà",
      "pressAgain": "Ẹsẹ ìkẹyìn — tẹ Èyí tó kàn lẹ́ẹ̀kan sí i fún {item}",
      "blanked": "A ti sọ ojú-ìbòjú di òfo",
      "cleared": "A ti pa ojú-ìbòjú rẹ́",
      "hymnDeleted": "A ti pa \"{title}\" rẹ́",
      "serviceDeleted": "A ti pa ètò ìsìn \"{name}\" rẹ́"
    }
  },
  "zh": {
    "app": {
      "title": "HymnFlow 控制台",
      "subtitle": "OBS HYMN 的下三分之一控制器 by @gbcowode",
      "status": {
        "live": "直播中",
        "storage": "localStorage",
        "ready": "准备就绪 ({storage})",
        "hymnUpdated": "赞美诗已更新",
        "hymnAdded": "赞美诗已添加"
      },
      "errors": {
        "sendFailed": "发送到叠加层时出错: {error}"
      }
    },
    "hymns": {
      "title": "赞美诗",
      "searchPlaceholder": "搜索赞美诗",
      "searchLabel": "按标题、作者或编号搜索赞美诗",
      "noHymnsFound": "未找到赞美诗",
      "noHymnSelected": "未选择赞美诗",
      "selectedTitle": "选定的赞美诗标题",
      "buttons": {
        "add": "+ 添加",
        "edit": "✏️ 编辑",
        "remove": "- 移除",
        "import": "导入",
        "export": "导出"
      },
      "labels": {
        "hymnNumber": "赞美诗编号",
        "sourceAbbr": "来源简称",
        "sourceName": "来源名称",
        "title": "标题",
        "author": "作者",
        "verses": "诗节",
        "chorus": "副歌",
        "versesSeparator": "(用空行分隔诗节)",
        "chorusOptional": "(可选)",
        "required": "*",
        "versesCount": "{count} 节"
      },
      "placeholders": {
        "number": "例如: 123",
        "sourceAbbr": "例如: CH, PD, HB",
        "sourceName": "例如: 圣诗集, 公有领域",
        "title": "赞美诗标题",
        "author": "作者姓名",
        "verses": "第 1 节文本\n\n第 2 节文本\n\n第 3 节文本",
        "chorus": "副歌文本"
      },
      "alerts": {
        "noChorus": "此赞美诗没有副歌",
        "noHymnSelected": "未选择赞美诗",
        "noHymnToEdit": "未选择要编辑的赞美诗",
        "titleRequired": "标题为必填项",
        "versesRequired": "至少需要一节诗",
        "validationFailed": "赞美诗验证失败:\n{errors}",
        "importFailed": "导入失败: {error}"
      },
      "confirmations": {
        "delete": "确实要删除 \"{title}\" 吗？"
      },
      "status": {
        "exported": "已导出 {filename}",
        "imported": "已导入 {count} 首赞美诗{skipped}"
      }
    },
    "services": {
      "title": "崇拜安排",
      "newButton": "+ 新建",
      "namePlaceholder": "安排名称 (例如: 主日早崇拜)",
      "noServicesFound": "尚未创建安排",
      "noHymnsInService": "尚未添加赞美诗",
      "hymnsCount": "{count} 首赞美诗",
      "buttons": {
        "addHymn": "+ 添加赞美诗",
        "save": "保存安排",
        "cancel": "取消",
        "load": "加载",
        "edit": "编辑",
        "delete": "删除"
      },
      "alerts": {
        "nameRequired": "安排名称为必填项",
        "atLeastOneHymn": "请至少向安排中添加一首赞美诗",
        "validationFailed": "安排验证失败:\n{errors}",
        "itemRequired": "请至少向流程添加一个项目"
      },
      "confirmations": {
        "delete": "确实要删除此安排吗？"
      },
      "status": {
        "validationIssues": "警告: 安排存在验证问题",
        "loaded": "已加载安排: {name} ({count} 首赞美诗)",
        "deleted": "安排已删除",
        "saved": "安排已保存",
        "hymnNotFound": "在库中找不到赞美诗",
        "divider": "▸ {label}",
        "hymnDeleted": "诗歌已删除（已更新 {count} 个流程）"
      },
      "errors": {
        "saveFailed": "保存安排时出错: {error}"
      },
      "addButtons": {
        "announce": "+ 公告",
        "divider": "+ 分隔",
        "hymn": "+ 诗歌",
        "scripture": "+ 经文"
      },
      "banner": {
        "nextItem": "下一个流程项目",
        "prevItem": "上一个流程项目"
      },
      "itemForm": {
        "buttons": {
          "addAnnounce": "添加公告",
          "addDivider": "添加分隔",
          "addScripture": "添加经文",
          "save": "保存"
        },
        "placeholders": {
          "announceText": "公告内容（例如：礼拜后欢迎参加团契）",
          "dividerLabel": "环节标签（例如：奉献、讲道、祷告）",
          "scriptureRef": "出处（例如：约翰福音 3:16）",
          "scriptureText": "经节文字（例如：神爱世人……）"
        },
        "titles": {
          "addAnnounce": "添加公告",
          "addDivider": "添加分隔",
          "addScripture": "添加经文",
          "editAnnounce": "编辑公告",
          "editDivider": "编辑分隔",
          "editScripture": "编辑经文"
        }
      }
    },
    "textSlide": {
      "title": "文字幻灯片",
      "hint": "经文、公告、空白屏幕",
      "sendButton": "发送到叠加层",
      "clearButton": "清除幻灯片",
      "sent": "文字幻灯片已发送",
      "cleared": "文字幻灯片已清除"
    },
    "bible": {
      "title": "圣经",
      "label": "圣经",
      "description": "导入任意译本的JSON文件以启用经文查找功能。每个译本单独存储——随时切换。",
      "importButton": "导入 JSON",
      "loading": "正在加载圣经…",
      "notLoaded": "未加载"
    },
    "quickScripture": {
      "title": "快速经文",
      "hint": "直播 · 即兴",
      "refPlaceholder": "引用 (例如，约翰福音 3:16)",
      "textPlaceholder": "经文文本 — 空行分隔页面",
      "lookupButton": "🔍",
      "displayButton": "显示",
      "clearButton": "清除",
      "status": "经文：{ref}",
      "statusNoRef": "经文已显示"
    },
    "navigation": {
      "verseInfo": "第 {current}/{total} 节 · 第 {startLine}-{endLine} 行，共 {totalLines} 行",
      "buttons": {
        "prevVerse": "⟵ 上一节",
        "nextVerse": "下一节 ⟶",
        "prevLine": "⬆ 上一行",
        "nextLine": "⬇ 下一行",
        "jumpChorus": "跳至副歌",
        "emergencyClear": "紧急清除"
      },
      "tooltips": {
        "prevVerse": "上一节 (左方向键)",
        "nextVerse": "下一节 (右方向键)",
        "prevLine": "上一行窗口 (上方向键)",
        "nextLine": "下一行窗口 (下方向键)",
        "jumpChorus": "显示副歌 (如果可用)",
        "emergencyClear": "立即从直播中隐藏叠加层"
      },
      "chorusNext": " · 接下来是副歌",
      "lastChorus": " · 最后一次副歌",
      "lastVerse": " · 最后一节",
      "shrinksToFit": " · ⚠ 缩小以适应",
      "chorusInfo": "副歌 · 第 {startLine}-{endLine} 行，共 {totalLines} 行"
    },
    "display": {
      "title": "显示控制",
      "displayLabel": "显示",
      "liveIndicator": "直播中",
      "resetButton": "重置",
      "resetTooltip": "重置为第一节、第一行",
      "linesPerDisplay": "每屏行数",
      "blanked": "已黑屏——点“显示”或“快速经文”可恢复",
      "displayOffHint": "显示已关闭——打开“显示”开关即可显示这首诗歌",
      "hotkeysReconnecting": "OBS 热键已断开——正在重新连接…",
      "noHymnSelected": "没有可显示的内容——请先选择一首诗歌",
      "offHint": "显示已关闭——打开“显示”开关即可显示这首诗歌"
    },
    "preview": {
      "title": "赞美诗预览"
    },
    "styles": {
      "title": "样式",
      "fontFamily": "字体名称",
      "fontSize": "字体大小",
      "bold": "加粗",
      "italic": "倾斜",
      "shadow": "阴影",
      "glow": "发光",
      "outline": "描边",
      "outlineColor": "描边颜色",
      "outlineWidth": "描边宽度",
      "textColor": "文本颜色",
      "bgType": "背景类型",
      "bgColorA": "背景颜色 A",
      "bgColorB": "背景颜色 B (用于渐变)",
      "animation": "动画效果",
      "position": "位置",
      "bgTypes": {
        "transparent": "透明",
        "solid": "纯色",
        "gradient": "渐变"
      },
      "animations": {
        "fade": "淡入淡出",
        "slide": "滑动",
        "none": "无"
      },
      "positions": {
        "bottom": "底部三分之一",
        "middle": "中间",
        "top": "顶部"
      }
    },
    "modal": {
      "editHymn": "编辑赞美诗",
      "addHymn": "添加赞美诗",
      "buttons": {
        "cancel": "取消",
        "save": "保存更改",
        "addAnyway": "仍然添加",
        "delete": "删除",
        "discard": "放弃",
        "ok": "确定"
      },
      "confirmations": {
        "badReference": "“{ref}”看起来不是有效的圣经出处。\n仍要添加吗？",
        "discard": "放弃未保存的更改吗？"
      }
    },
    "settings": {
      "title": "设置",
      "language": "语言",
      "languageLabel": "界面语言"
    },
    "tabs": {
      "library": "曲库",
      "service": "安排",
      "live": "直播",
      "style": "样式"
    },
    "setup": {
      "import": {
        "selectFile": "选择下载的 .json、.txt 或 .csv 文件"
      },
      "controls": {
        "exportDesc": "将赞美诗保存到 hymnflow-export.json"
      },
      "features": {
        "importFormats": "导入 .txt、.csv 或 .json 文件"
      },
      "importFormats": {
        "csv": "CSV 格式"
      }
    },
    "ui": {
      "blank_screen": "黑屏",
      "restore": "↩ 恢复",
      "shortcuts": "? 快捷键",
      "tip_drop_any_downloaded_file_anywhere": "提示：把下载的任何文件拖放到面板的任意位置——圣经（.zip、.json、USFM）、诗歌、聚会流程或备份。HymnFlow 会自动识别、解压并转换。",
      "get_another_translation": "获取其他译本",
      "hymnflow_never_downloads_anything_itself_pick": "HymnFlow 本身不会下载任何内容。选择语言，打开链接，保存文件，然后拖放到上方的圣经卡片上——无需解压或转换。请核对每个译本的授权。",
      "language": "语言",
      "import": "导入",
      "cancel": "取消",
      "auto_display_planned_scripture": "自动显示计划的经文",
      "background_opacity": "背景不透明度",
      "scripture_display": "经文显示",
      "scripture_font": "经文字体",
      "classic_serif_default": "经典衬线体（默认）",
      "same_as_lyrics": "与歌词相同",
      "italic_text": "斜体文字",
      "show_reference": "显示出处",
      "translation_badge": "译本标记",
      "custom_size": "自定义大小",
      "scripture_font_size": "经文字号",
      "obs_connection": "OBS 连接",
      "host": "主机",
      "port": "端口",
      "password": "密码",
      "connect": "连接",
      "disconnect": "断开",
      "hotkeys_dock_focus": "快捷键（面板获得焦点时）",
      "data_backup": "数据与备份",
      "hymns_services_and_settings_are_stored": "诗歌、聚会流程和设置保存在此浏览器中。每次打开面板都会自动创建快照，删除诗歌或流程后几秒内可撤销。",
      "export_backup": "导出备份…",
      "restore_from_file": "从文件恢复…",
      "usage_report_each_hymn_put_on": "使用报告：每首显示在屏幕上的诗歌都会记录在本设备上（日期、标题、CCLI 编号），方便你向 CCLI 申报。不会向任何地方发送数据。",
      "export_usage_report_csv": "导出使用报告（CSV）…",
      "clear_usage_log": "清除使用记录",
      "automatic_snapshots": "自动快照",
      "restore_selected_snapshot": "恢复所选快照",
      "bibles_are_stored_separately_and_are": "圣经单独存储，不受备份或恢复影响。OBS 连接信息和密码绝不会写入备份文件。",
      "licensing_credits": "授权与致谢",
      "livestreaming": "直播：",
      "showing_copyrighted_lyrics_on_a_livestream": "在直播中显示有版权的歌词，通常除了教会的版权许可外，还需要流媒体许可（例如 CCLI 或 OneLicense）。各国家和平台要求不同——请咨询您的授权提供方。公有领域的诗歌无需许可。请在每首诗歌的编辑表单中记录其版权和 CCLI 编号。",
      "bible_translations": "圣经译本：",
      "you_are_responsible_for_having_the": "您有责任确保有权使用所导入的译本。公有领域和开放授权的文本没有问题；其他文本需要出版方许可。",
      "ask_for_a_second_press_before": "进入下一个流程项目前需再按一次",
      "copyright": "版权",
      "ccli": "CCLI 编号",
      "name_optional": "名称（可选）",
      "search_by_title_author_or_number": "按标题、作者或编号搜索…",
      "reference_or_label": "出处或标签",
      "enter_text": "输入文字…",
      "type_any_text_to_send_to": "输入要发送到画面的任意文字（经文、公告、黑屏……）",
      "leave_blank_if_none": "（没有则留空）",
      "e_g_public_domain_or_1990": "例如：公有领域，或 © 1990 出版社",
      "take_the_screen_down_without_losing": "撤下画面但保留当前位置（B）",
      "bring_back_what_was_on_screen": "恢复黑屏/清除之前屏幕上的内容（Z）",
      "keyboard_shortcuts": "键盘快捷键（?）",
      "previous_item_in_service": "上一个流程项目",
      "next_item_in_service": "下一个流程项目",
      "import_a_service_schedule_from_a": "从文本文件导入聚会流程",
      "active_translation": "当前译本",
      "look_up_verse": "查找经节",
      "skip_the_confidence_preview_planned_scripture": "跳过预览：计划的经文在激活时直接显示到画面上",
      "on_the_last_verse_the_first": "在最后一节时，第一次点“下一个”仅作准备；几秒内再按一次才会进入下一个流程项目",
      "storage_type": "存储类型",
      "main_navigation": "主导航",
      "keyboard_shortcuts_2": "键盘快捷键",
      "filter_by_source": "按来源筛选",
      "hymns_library": "诗歌库",
      "select_hymn_file_to_import": "选择要导入的诗歌文件",
      "translation_name_optional_filled_in_automaticall": "译本名称（可选，自动填写）",
      "select_a_bible_file": "选择圣经文件",
      "select_service_schedule_text_file": "选择聚会流程文本文件",
      "saved_services": "已保存的流程",
      "jump_to_verse": "跳到经节",
      "scripture_reference": "经文出处",
      "bible_translation": "圣经译本",
      "verse_text": "经节文字",
      "previous_page": "上一页",
      "next_page": "下一页",
      "background_opacity_2": "背景不透明度"
    },
    "drop": {
      "overlay": "拖放以导入",
      "unsupported": "无法导入这种文件。请使用诗歌文件（.txt、.csv、.json、.cho、.usr）、圣经文件（.zip、.json、.usfm）、聚会流程（.txt）或 HymnFlow 备份（.json）。"
    },
    "msg": {
      "noSnapshots": "暂无快照",
      "shortcutsNote": "面板获得焦点时快捷键才有效。若要在任何窗口都能使用，请在“样式 → OBS 连接”中连接 OBS 热键。",
      "hotkeysOn": "全局热键：已开启",
      "hotkeysConnecting": "全局热键：连接中…",
      "hotkeysOff": "全局热键：已关闭",
      "hotkeysConnected": "OBS 热键已连接",
      "storageFullHymns": "存储已满（{count} 首诗歌）。请先导出诗歌，再清理存储后继续。",
      "storageFull": "存储已满——请导出诗歌以释放空间。",
      "errorSavingHymns": "保存诗歌出错：{error}",
      "errorSavingSettings": "保存设置出错：{error}",
      "errorSavingServices": "保存流程出错：{error}",
      "bibleNotLoaded": "尚未载入圣经——请在“库”标签页导入译本",
      "draftRestored": "已恢复未保存的流程草稿",
      "listLabel": "列表标签：“{label}”",
      "cueNotes": "提示备注 — {item}",
      "serviceDeletedShort": "流程已删除",
      "duplicated": "已复制：“{name}”",
      "serviceImportEmpty": "导入失败：文件中没有流程项目",
      "serviceImported": "已导入“{name}”——{count} 个项目{warnings}",
      "warningsCount": "{count} 条警告",
      "serviceImportWarnings": "流程已导入，但有警告：",
      "couldNotRead": "无法读取文件",
      "importing": "正在导入…（{done}/{total}）",
      "importFailed": "导入失败：{error}",
      "kjvLoaded": "KJV 已载入——可查找经文",
      "noUsage": "尚未显示过任何诗歌。",
      "clearUsageConfirm": "要清除此设备上的使用记录吗？如需用于申报，请先导出。",
      "clear": "清除",
      "usageCleared": "使用记录已清除",
      "creditsIntro": "已载入译本的致谢信息（请列入教会的致谢名单）：",
      "open": "打开",
      "copyLink": "复制链接",
      "linkCopied": "链接已复制",
      "copyManually": "选中上方的链接文字并复制（Ctrl+C）",
      "hotkeysSetupTitle": "点击设置全局热键（样式 → OBS 连接）"
    },
    "bibleGet": {
      "otherLanguages": "其他语言",
      "license": {
        "pd": "公有领域",
        "bibliatodo": "免费授权（BibliaTodo v1.9）——需署名",
        "ccbysa": "CC BY-SA 4.0——需注明 Biblica",
        "varies": "各不相同——请逐一查看"
      },
      "steps": {
        "save": "保存文件，然后拖放到上方的圣经卡片上。",
        "zip": "下载 JSON ZIP 并拖放到上方的圣经卡片上（无需解压）。",
        "ntbt": "把下载的 ZIP 拖放到上方的圣经卡片上（无需解压）。",
        "yoruba": "在该页面下载 USFM（.zip）版本，并拖放到上方的圣经卡片上——HymnFlow 会为你转换。",
        "ebible": "数百种译本。下载 USFM（.zip）版本并拖放到上方的圣经卡片上。"
      }
    },
    "operator": {
      "corruptKept": "无法读取已保存的 {name} 数据。已在浏览器存储中保留了一份副本（hymnflow-corrupt-{name}-*），可用于恢复。",
      "restore": "恢复",
      "noSnapshot": "该快照已不可用。",
      "notBackup": "该文件不是 HymnFlow 备份。",
      "emptyBackup": "备份中没有可用的诗歌。",
      "undo": "撤销",
      "undone": "已恢复",
      "nothingToRestore": "没有可恢复的内容",
      "restored": "已恢复屏幕上之前的内容",
      "pressAgain": "最后一节——再按一次“下一个”进入 {item}",
      "blanked": "已黑屏",
      "cleared": "已清屏",
      "hymnDeleted": "已删除“{title}”",
      "serviceDeleted": "已删除流程“{name}”"
    }
  }
};
