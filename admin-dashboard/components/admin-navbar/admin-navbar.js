/**
 * Admin Navbar Component
 */
function renderAdminNavbar(targetId = 'admin-topbar') {
  const container = document.getElementById(targetId);
  if (!container) return;

  const isSubpage = window.location.pathname.includes('/pages/');
  const root = isSubpage ? '../../' : './';
  const user = adminAuthService.getUser();

  container.innerHTML = `
    <div class="admin-navbar-inner">
      <div style="font-weight: 700; font-size: 1.1rem; color: var(--admin-text-main);">
        K's Enterprises — Administration Portal
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 0.85rem; color: var(--admin-text-muted);">
          Logged in as <strong>${user?.name || 'Administrator'}</strong>
        </span>
        <a href="${root}../frontend/pages/home/index.html" target="_blank" class="btn-admin btn-admin-outline" style="font-size: 0.8rem;">
          🌐 View Live Site
        </a>
        <button class="btn-admin btn-admin-danger" style="font-size: 0.8rem;" onclick="adminAuthService.logout()">
          Logout
        </button>
      </div>
    </div>
  `;
}
