/**
 * K's Enterprises - Theme Toggle Component
 */
function renderThemeToggle(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentTheme = themeService ? themeService.getTheme() : 'light';

  container.innerHTML = `
    <button 
      class="theme-toggle-btn" 
      onclick="themeService.toggleTheme()" 
      title="Toggle Light/Dark Theme"
      aria-label="Toggle Theme"
    >
      ${currentTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  `;
}
