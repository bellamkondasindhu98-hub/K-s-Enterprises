/**
 * K's Enterprises - Internationalization (i18n) Service
 * Supports English (en), Telugu (te), Hindi (hi)
 */
class I18nService {
  constructor() {
    this.storageKey = 'ks_language_preference';
    this.currentLang = localStorage.getItem(this.storageKey) || 'en';
    this.translations = {};
    this.fallbackLang = 'en';
  }

  async loadLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      this.applyTranslations();
      return;
    }

    try {
      // Determine root path offset depending on current folder depth
      const isSubpage = window.location.pathname.includes('/pages/');
      const basePath = isSubpage ? '../../locales/' : './locales/';
      
      const response = await fetch(`${basePath}${lang}.json`);
      if (!response.ok) throw new Error(`Could not load locale: ${lang}`);
      
      this.translations[lang] = await response.json();
      this.currentLang = lang;
      localStorage.setItem(this.storageKey, lang);
      this.applyTranslations();
    } catch (e) {
      console.warn(`[i18n] Failed to load language ${lang}, falling back to ${this.fallbackLang}`, e);
      if (lang !== this.fallbackLang) {
        await this.loadLanguage(this.fallbackLang);
      }
    }
  }

  t(keyPath) {
    const dict = this.translations[this.currentLang] || this.translations[this.fallbackLang] || {};
    const keys = keyPath.split('.');
    let value = dict;
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        return keyPath; // fallback to key path if missing
      }
    }
    return value;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = this.t(key);
      if (translated) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', translated);
        } else {
          el.textContent = translated;
        }
      }
    });

    // Update language select dropdowns if present
    document.querySelectorAll('.language-select').forEach(select => {
      select.value = this.currentLang;
    });
  }

  async setLanguage(lang) {
    await this.loadLanguage(lang);
  }

  getLanguage() {
    return this.currentLang;
  }
}

const i18nService = new I18nService();
if (typeof window !== 'undefined') {
  window.i18nService = i18nService;
  document.addEventListener('DOMContentLoaded', () => {
    i18nService.loadLanguage(i18nService.getLanguage());
  });
}
