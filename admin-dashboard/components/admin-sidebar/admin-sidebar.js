/**
 * Admin Sidebar Component
 */
function renderAdminSidebar(targetId = 'admin-sidebar') {
  const container = document.getElementById(targetId);
  if (!container) return;

  const isSubpage = window.location.pathname.includes('/pages/');
  const root = isSubpage ? '../../' : './';
  const path = window.location.pathname;

  container.innerHTML = `
    <div class="sidebar-brand">
      🐟 K's Enterprises
    </div>
    <ul class="sidebar-menu">
      <li class="sidebar-item ${path.includes('/dashboard') ? 'active' : ''}">
        <a href="${root}pages/dashboard/index.html"><span class="sidebar-nav-icon">📊</span> Overview</a>
      </li>
      <li class="sidebar-item ${path.includes('/products') ? 'active' : ''}">
        <a href="${root}pages/products/index.html"><span class="sidebar-nav-icon">🐟</span> Products</a>
      </li>
      <li class="sidebar-item ${path.includes('/reviews') ? 'active' : ''}">
        <a href="${root}pages/reviews/index.html"><span class="sidebar-nav-icon">⭐</span> Reviews</a>
      </li>
      <li class="sidebar-item ${path.includes('/comparison') ? 'active' : ''}">
        <a href="${root}pages/comparison/index.html"><span class="sidebar-nav-icon">⚖️</span> Comparison</a>
      </li>
      <li class="sidebar-item ${path.includes('/recommendations') ? 'active' : ''}">
        <a href="${root}pages/recommendations/index.html"><span class="sidebar-nav-icon">💡</span> Recommendations</a>
      </li>
      <li class="sidebar-item ${path.includes('/company') ? 'active' : ''}">
        <a href="${root}pages/company/index.html"><span class="sidebar-nav-icon">🏢</span> Company & CEO</a>
      </li>
      <li class="sidebar-item ${path.includes('/website') ? 'active' : ''}">
        <a href="${root}pages/website/index.html"><span class="sidebar-nav-icon">🌐</span> Website Content</a>
      </li>
      <li class="sidebar-item ${path.includes('/customers') ? 'active' : ''}">
        <a href="${root}pages/customers/index.html"><span class="sidebar-nav-icon">👥</span> Customers</a>
      </li>
      <li class="sidebar-item ${path.includes('/feedback') ? 'active' : ''}">
        <a href="${root}pages/feedback/index.html"><span class="sidebar-nav-icon">💬</span> Feedback</a>
      </li>
    </ul>
  `;
}
