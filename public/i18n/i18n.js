// HymnFlow Internationalization Module
// Zero-dependency i18n for HymnFlow
(() => {
  const STORAGE_KEY = 'hymnflow-language';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGUAGES = ['en', 'yo'];
  
  let currentLanguage = DEFAULT_LANG;
  let translations = {};
  let loadedLanguages = {};

  // Initialize i18n
  async function init() {
    // Load saved language preference
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      currentLanguage = savedLang;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        currentLanguage = browserLang;
      }
    }

    // Load default language
    await loadLanguage(currentLanguage);
    
    // Apply translations to the page
    translatePage();
    
    return currentLanguage;
  }

  // Load language file
  async function loadLanguage(lang) {
    if (loadedLanguages[lang]) {
      translations = loadedLanguages[lang];
      return;
    }

    try {
      const response = await fetch(`../i18n/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }
      const data = await response.json();
      loadedLanguages[lang] = data;
      translations = data;
      return data;
    } catch (error) {
      console.error(`[i18n] Error loading language ${lang}:`, error);
      
      // Fallback to English if not already English
      if (lang !== DEFAULT_LANG) {
        console.warn(`[i18n] Falling back to ${DEFAULT_LANG}`);
        return loadLanguage(DEFAULT_LANG);
      }
      
      return null;
    }
  }

  // Change language
  async function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`[i18n] Unsupported language: ${lang}`);
      return false;
    }

    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    
    await loadLanguage(lang);
    translatePage();
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
    
    return true;
  }

  // Get translation by key (supports nested keys like 'app.title')
  function t(key, params = {}) {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`[i18n] Translation key not found: ${key}`);
        return key; // Return key itself if not found
      }
    }

    // Replace parameters in the translation
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value;
  }

  // Translate the entire page
  function translatePage() {
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    // Translate titles (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });

    // Translate aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key));
    });
  }

  // Get current language
  function getLanguage() {
    return currentLanguage;
  }

  // Get supported languages
  function getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  // Export i18n object
  window.i18n = {
    init,
    setLanguage,
    t,
    translatePage,
    getLanguage,
    getSupportedLanguages
  };
})();
