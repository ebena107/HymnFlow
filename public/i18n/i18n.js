// HymnFlow Internationalization (i18n) Module
// Supports multiple languages with dynamic loading and switching

(() => {
  // Available languages
  const AVAILABLE_LANGUAGES = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'pt': 'Português',
    'sw': 'Kiswahili',
    'tl': 'Tagalog',
    'yo': 'Yorùbá',
    'zh': '中文',
    'ko': '한국어'
  };

  const DEFAULT_LANGUAGE = 'en';
  const STORAGE_KEY = 'hymnflow-language';

  let currentLanguage = DEFAULT_LANGUAGE;
  let translations = {};

  function loadTranslations(lang) {
    if (window.HymnFlowTranslations && window.HymnFlowTranslations[lang]) {
      return window.HymnFlowTranslations[lang];
    }
    console.warn(`Translations for ${lang} not found in window.HymnFlowTranslations`);
    // Fallback to English if the language fails to load
    if (lang !== DEFAULT_LANGUAGE && window.HymnFlowTranslations && window.HymnFlowTranslations[DEFAULT_LANGUAGE]) {
      console.warn(`Falling back to ${DEFAULT_LANGUAGE}`);
      return window.HymnFlowTranslations[DEFAULT_LANGUAGE];
    }
    return {};
  }

  // ========================================
  // Get nested translation value
  // ========================================
  function getTranslation(key, replacements = {}) {
    const keys = key.split('.');

    // Helper to get value from a specific dictionary
    const getValue = (dict) => {
      let val = dict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          return null;
        }
      }
      return val;
    };

    // 1. Try current language
    let value = getValue(translations);

    // 2. Fallback to the English dictionary if not found. Also covers calls
    // made before init() has populated `translations` (dock renders eagerly).
    if (value === null && window.HymnFlowTranslations && window.HymnFlowTranslations[DEFAULT_LANGUAGE]) {
      value = getValue(window.HymnFlowTranslations[DEFAULT_LANGUAGE]);
    }

    // 3. Last resort: return the key itself
    if (value === null) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Replace placeholders like {current}, {total}, etc.
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, placeholder) => {
        return replacements[placeholder] !== undefined ? replacements[placeholder] : match;
      });
    }

    return value;
  }

  // ========================================
  // Apply translations to DOM elements
  // ========================================
  function applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getTranslation(key);

      // Check if we should update text content or specific attribute
      const attr = element.getAttribute('data-i18n-attr');
      if (attr) {
        element.setAttribute(attr, translation);
      } else {
        element.textContent = translation;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = getTranslation(key);
    });

    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      element.setAttribute('aria-label', getTranslation(key));
    });

    // Update titles (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = getTranslation(key);
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;

    // Dispatch event for custom handling
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: currentLanguage, translations }
    }));
  }

  // ========================================
  // Change language
  // ========================================
  // Picks the first browser-preferred language HymnFlow supports (English if none).
  // Used on first launch so a Spanish-speaking church sees Spanish without any setup.
  function detectLanguage(preferred) {
    const list = preferred || (typeof navigator !== 'undefined' ? (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) : []);
    const alias = { fil: 'tl' };
    for (const raw of list || []) {
      const base = String(raw || '').toLowerCase().split(/[-_]/)[0];
      const code = alias[base] || base;
      if (AVAILABLE_LANGUAGES[code]) return code;
    }
    return DEFAULT_LANGUAGE;
  }

  // persist=false keeps an automatically detected language from being saved as a choice,
  // so it keeps following the browser until the user picks one themselves.
  function changeLanguage(lang, persist = true) {
    let resolvedLang = lang;
    if (!AVAILABLE_LANGUAGES[resolvedLang]) {
      console.warn(`Language ${lang} is not supported. Falling back to ${DEFAULT_LANGUAGE}.`);
      resolvedLang = DEFAULT_LANGUAGE;
    }

    try {
      translations = loadTranslations(resolvedLang);
      currentLanguage = resolvedLang;
      if (persist) localStorage.setItem(STORAGE_KEY, resolvedLang);
      applyTranslations();
      return true;
    } catch (error) {
      console.error(`Failed to change language to ${resolvedLang}:`, error);
      return false;
    }
  }

  // ========================================
  // Initialize i18n
  // ========================================
  function init() {
    // Use the saved choice; on first launch follow the browser's language.
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang) changeLanguage(savedLang);
    else changeLanguage(detectLanguage(), false);
  }

  // ========================================
  // Public API
  // ========================================
  window.HymnFlowI18n = {
    init,
    changeLanguage,
    detectLanguage,
    getTranslation,
    getCurrentLanguage: () => currentLanguage,
    getAvailableLanguages: () => AVAILABLE_LANGUAGES,
    applyTranslations
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
