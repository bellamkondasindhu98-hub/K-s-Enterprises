/**
 * K's Enterprises - Language Selector Component
 */
function renderLanguageSelector(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentLang = i18nService ? i18nService.getLanguage() : 'en';

  container.innerHTML = `
    <div class="language-selector-wrapper">
      <select class="language-dropdown language-select" onchange="i18nService.setLanguage(this.value)" aria-label="Select Language">
        <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
        <option value="te" ${currentLang === 'te' ? 'selected' : ''}>తెలుగు</option>
        <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>हिन्दी</option>
      </select>
    </div>
  `;
}
