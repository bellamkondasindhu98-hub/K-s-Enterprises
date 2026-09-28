/**
 * K's Enterprises - Reusable Navbar Component
 */
function renderNavbar(targetElementId = 'app-navbar') {
  const container = document.getElementById(targetElementId);
  if (!container) return;

  const isSubpage = window.location.pathname.includes('/pages/');
  const rootPath = isSubpage ? '../../' : './';
  const currentPath = window.location.pathname;

  const isAuth = authService?.isAuthenticated?.() || false;
  const user = authService?.getUser?.() || null;

  const navHtml = `
    <nav class="navbar">
      <div class="navbar-container">
        <a href="${rootPath}pages/home/index.html" class="navbar-brand">
          <img src="${rootPath}assets/logos/ks-enterprises-logo.svg" alt="K's Enterprises Logo" class="navbar-logo">
        </a>

        <ul class="navbar-nav" id="main-nav-links">
          <li><a href="${rootPath}pages/home/index.html" class="nav-link ${currentPath.includes('/home') ? 'active' : ''}" data-i18n="nav.home">Home</a></li>
          <li><a href="${rootPath}pages/products/index.html" class="nav-link ${currentPath.includes('/products') ? 'active' : ''}" data-i18n="nav.products">Products</a></li>
          <li><a href="${rootPath}pages/company-profile/index.html" class="nav-link ${currentPath.includes('/company-profile') ? 'active' : ''}" data-i18n="nav.company">Company</a></li>
          <li><a href="${rootPath}pages/why-choose-us/index.html" class="nav-link ${currentPath.includes('/why-choose-us') ? 'active' : ''}" data-i18n="nav.whyChooseUs">Why Choose Us</a></li>
          <li><a href="${rootPath}pages/feedback/index.html" class="nav-link ${currentPath.includes('/feedback') ? 'active' : ''}" data-i18n="nav.feedback">Feedback</a></li>
          <li><a href="${rootPath}pages/help-center/index.html" class="nav-link ${currentPath.includes('/help-center') ? 'active' : ''}" data-i18n="nav.helpCenter">Help Center</a></li>
        </ul>

        <div class="navbar-actions">
          <!-- Search Trigger -->
          <a href="${rootPath}pages/search/index.html" class="btn-icon" title="Search Products" aria-label="Search">
            🔍
          </a>

          <!-- Wishlist Trigger -->
          <a href="${rootPath}pages/wishlist/index.html" class="btn-icon" title="Wishlist" aria-label="Wishlist">
            ❤️
          </a>

          <!-- Language Selector -->
          <select class="form-select language-select" style="width: auto; padding: 0.4rem 0.6rem; font-size: 0.85rem;" onchange="i18nService.setLanguage(this.value)">
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिन्दी</option>
          </select>

          <!-- Theme Toggle -->
          <button class="btn-icon theme-toggle-btn" onclick="themeService.toggleTheme()" title="Toggle Theme" aria-label="Toggle Theme">
            🌙
          </button>

          <!-- Auth Section -->
          ${isAuth ? `
            <div class="user-menu" style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${user?.name?.split(' ')[0] || 'User'}
              </span>
              <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="authService.logout()" data-i18n="nav.logout">Logout</button>
            </div>
          ` : `
            <a href="${rootPath}pages/login/index.html" class="btn btn-primary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;" data-i18n="nav.login">Login</a>
          `}

          <!-- Mobile Toggle -->
          <button class="mobile-menu-btn" onclick="document.getElementById('main-nav-links').classList.toggle('active')" aria-label="Toggle Navigation Menu">
            ☰
          </button>
        </div>
      </div>
    </nav>
  `;

  container.innerHTML = navHtml;
  if (window.i18nService) {
    window.i18nService.applyTranslations();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});
