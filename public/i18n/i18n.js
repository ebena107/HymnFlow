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
    'tl': 'Tagalog'
  };

  const DEFAULT_LANGUAGE = 'en';
  const STORAGE_KEY = 'hymnflow-language';
  
  let currentLanguage = DEFAULT_LANGUAGE;
  let translations = {};

  // ========================================
  // Load translation file
  // ========================================
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`../i18n/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      // Fallback to English if the language file fails to load
      if (lang !== DEFAULT_LANGUAGE) {
        console.warn(`Falling back to ${DEFAULT_LANGUAGE}`);
        return loadTranslations(DEFAULT_LANGUAGE);
      }
      return {};
    }
  }

  // ========================================
  // Get nested translation value
  // ========================================
  function getTranslation(key, replacements = {}) {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key itself if not found
      }
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
  async function changeLanguage(lang) {
    if (!AVAILABLE_LANGUAGES[lang]) {
      console.error(`Language ${lang} is not supported`);
      return false;
    }

    try {
      translations = await loadTranslations(lang);
      currentLanguage = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      applyTranslations();
      return true;
    } catch (error) {
      console.error(`Failed to change language to ${lang}:`, error);
      return false;
    }
  }

  // ========================================
  // Initialize i18n
  // ========================================
  async function init() {
    // Load saved language preference or use default
    const savedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
    await changeLanguage(savedLang);
  }

  // ========================================
  // Public API
  // ========================================
  window.HymnFlowI18n = {
    init,
    changeLanguage,
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
