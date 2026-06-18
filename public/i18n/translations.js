// HymnFlow Consolidated Translations
// Generated automatically to support file:// protocol compatibility

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
      "displayLabel": "Display",
      "liveIndicator": "LIVE",
      "resetButton": "Reset",
      "resetTooltip": "Reset to first verse, first line",
      "linesPerDisplay": "Lines per display"
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
        "save": "Save Changes"
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
        "hymnAdded": "Himno añadido"
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
        "validationFailed": "Error de validación del servicio:\n{errors}"
      },
      "confirmations": {
        "delete": "¿Eliminar este servicio?"
      },
      "status": {
        "validationIssues": "Advertencia: El servicio tiene problemas de validación",
        "loaded": "Servicio cargado: {name} ({count} himnos)",
        "deleted": "Servicio eliminado",
        "saved": "Servicio guardado",
        "hymnNotFound": "Himno no encontrado en la biblioteca"
      },
      "errors": {
        "saveFailed": "Error al guardar los servicios: {error}"
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
      }
    },
    "display": {
      "title": "Controles de visualización",
      "displayLabel": "Visualización",
      "liveIndicator": "EN VIVO",
      "resetButton": "Restablecer",
      "resetTooltip": "Restablecer al primer verso, primera línea",
      "linesPerDisplay": "Líneas por visualización"
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
        "save": "Guardar cambios"
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
        "hymnAdded": "Cantique ajouté"
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
        "validationFailed": "Échec de la validation du service :\n{errors}"
      },
      "confirmations": {
        "delete": "Supprimer ce service ?"
      },
      "status": {
        "validationIssues": "Attention : Le service présente des problèmes de validation",
        "loaded": "Service chargé : {name} ({count} cantiques)",
        "deleted": "Service supprimé",
        "saved": "Service enregistré",
        "hymnNotFound": "Cantique introuvable dans la bibliothèque"
      },
      "errors": {
        "saveFailed": "Erreur lors de l'enregistrement des services : {error}"
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
      }
    },
    "display": {
      "title": "Contrôles d'affichage",
      "displayLabel": "Affichage",
      "liveIndicator": "EN DIRECT",
      "resetButton": "Réinitialiser",
      "resetTooltip": "Réinitialiser au premier verset, première ligne",
      "linesPerDisplay": "Lignes par affichage"
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
        "save": "Enregistrer les modifications"
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
    }
  },
  "ko": {
    "app": {
      "title": "HymnFlow Dock",
      "subtitle": "OBS HYMN용 하단 3분위 컨트롤러 by @gbcowode",
      "status": {
        "live": "라이브",
        "storage": "로컬 저장소",
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
        "validationFailed": "순서 검증 실패:\n{errors}"
      },
      "confirmations": {
        "delete": "이 예배 순서를 삭제하시겠습니까?"
      },
      "status": {
        "validationIssues": "경고: 순서에 검증 문제가 있습니다",
        "loaded": "순서를 불러왔습니다: {name} ({count}곡)",
        "deleted": "순서가 삭제되었습니다",
        "saved": "순서가 저장되었습니다",
        "hymnNotFound": "라이브러리에서 찬송가를 찾을 수 없음"
      },
      "errors": {
        "saveFailed": "순서 저장 중 오류 발생: {error}"
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
      }
    },
    "display": {
      "title": "표시 제어",
      "displayLabel": "표시",
      "liveIndicator": "라이브",
      "resetButton": "초기화",
      "resetTooltip": "첫 절, 첫 행으로 초기화",
      "linesPerDisplay": "화면당 행 수"
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
        "save": "변경 사항 저장"
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
        "hymnAdded": "Hino adicionado"
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
        "validationFailed": "Falha na validação do serviço:\n{errors}"
      },
      "confirmations": {
        "delete": "Excluir este serviço?"
      },
      "status": {
        "validationIssues": "Aviso: O serviço tem problemas de validação",
        "loaded": "Serviço carregado: {name} ({count} hinos)",
        "deleted": "Serviço excluído",
        "saved": "Serviço salvo",
        "hymnNotFound": "Hino não encontrado na biblioteca"
      },
      "errors": {
        "saveFailed": "Erro ao salvar os serviços: {error}"
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
      }
    },
    "display": {
      "title": "Controles de exibição",
      "displayLabel": "Exibição",
      "liveIndicator": "AO VIVO",
      "resetButton": "Redefinir",
      "resetTooltip": "Redefinir para o primeiro verso, primeira linha",
      "linesPerDisplay": "Linhas por exibição"
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
        "save": "Salvar alterações"
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
        "validationFailed": "Uthibitishaji wa huduma umeshindwa:\n{errors}"
      },
      "confirmations": {
        "delete": "Futa huduma hii?"
      },
      "status": {
        "validationIssues": "Onyo: Huduma ina masuala ya uthibitishaji",
        "loaded": "Huduma iliyopakiwa: {name} ({count} nyimbo)",
        "deleted": "Huduma imefutwa",
        "saved": "Huduma imehifadhiwa",
        "hymnNotFound": "Wimbo haujapatikana kwenye maktaba"
      },
      "errors": {
        "saveFailed": "Hitilafu wakati wa kuhifadhi huduma: {error}"
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
      }
    },
    "display": {
      "title": "Vidhibiti vya kuonyesha",
      "displayLabel": "Onyesha",
      "liveIndicator": "MOJA KWA MOJA",
      "resetButton": "Weka upya",
      "resetTooltip": "Weka upya kwa beti ya kwanza, mstari wa kwanza",
      "linesPerDisplay": "Mistari kwa onyesho"
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
        "save": "Hifadhi mabadiliko"
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
        "validationFailed": "Bigo ang pag-validate sa serbisyo:\n{errors}"
      },
      "confirmations": {
        "delete": "I-delete ang serbisyong ito?"
      },
      "status": {
        "validationIssues": "Babala: May mga isyu sa pag-validate ang serbisyo",
        "loaded": "Na-load ang serbisyo: {name} ({count} (na) himno)",
        "deleted": "Na-delete ang serbisyo",
        "saved": "Na-save ang serbisyo",
        "hymnNotFound": "Hindi mahanap ang himno sa library"
      },
      "errors": {
        "saveFailed": "Error sa pag-save ng mga serbisyo: {error}"
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
      }
    },
    "display": {
      "title": "Mga Kontrol sa Display",
      "displayLabel": "Display",
      "liveIndicator": "LIVE",
      "resetButton": "I-reset",
      "resetTooltip": "I-reset sa unang bersikulo, unang linya",
      "linesPerDisplay": "Mga linya bawat display"
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
        "save": "I-save ang mga Pagbabago"
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
        "validationFailed": "Ìfihàn ìsìn kùnà:\n{errors}"
      },
      "confirmations": {
        "delete": "Pa ìsìn yìí rẹ́?"
      },
      "status": {
        "validationIssues": "Ìkìlọ̀: Ìsìn yìí ní àwọn ìṣòro ìfihàn",
        "loaded": "Ìsìn tí a gbé jáde: {name} (orin {count})",
        "deleted": "A ti pa ìsìn rẹ́",
        "saved": "A ti fi ìsìn pa mọ́",
        "hymnNotFound": "A kò rí orin náà nínú ìkójọpọ̀"
      },
      "errors": {
        "saveFailed": "Àṣìṣe nígbà tí a ń fi ìsìn pa mọ́: {error}"
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
      }
    },
    "display": {
      "title": "Àwọn Ìṣàkóso Ìfihàn",
      "displayLabel": "Ìfihàn",
      "liveIndicator": "LÓRÍ ATFẸFERẸ",
      "resetButton": "Tunṣe",
      "resetTooltip": "Tunṣe sí ẹsẹ àkọ́kọ́, ìlà àkọ́kọ́",
      "linesPerDisplay": "Ìlà fún ìfihàn kọ̀ọ̀kan"
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
        "save": "Fi Àtúnṣe Pa Mọ́"
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
    }
  },
  "zh": {
    "app": {
      "title": "HymnFlow 控制台",
      "subtitle": "OBS HYMN 的下三分之一控制器 by @gbcowode",
      "status": {
        "live": "直播中",
        "storage": "本地存储",
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
        "validationFailed": "安排验证失败:\n{errors}"
      },
      "confirmations": {
        "delete": "确实要删除此安排吗？"
      },
      "status": {
        "validationIssues": "警告: 安排存在验证问题",
        "loaded": "已加载安排: {name} ({count} 首赞美诗)",
        "deleted": "安排已删除",
        "saved": "安排已保存",
        "hymnNotFound": "在库中找不到赞美诗"
      },
      "errors": {
        "saveFailed": "保存安排时出错: {error}"
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
      }
    },
    "display": {
      "title": "显示控制",
      "displayLabel": "显示",
      "liveIndicator": "直播中",
      "resetButton": "重置",
      "resetTooltip": "重置为第一节、第一行",
      "linesPerDisplay": "每屏行数"
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
        "save": "保存更改"
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
    }
  }
};
