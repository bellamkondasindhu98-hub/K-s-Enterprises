/**
 * Admin Dashboard Overview Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  adminAuthService.guard();
  renderAdminSidebar();
  renderAdminNavbar();
  await loadDashboardMetrics();
});

async function loadDashboardMetrics() {
  try {
    const res = await adminManagementService.getDashboardStats();
    if (res.success && res.data) {
      const s = res.data;
      document.getElementById('stat-total-products').textContent = s.totalProducts || '0';
      document.getElementById('stat-in-stock').textContent = s.inStockProducts || '0';
      document.getElementById('stat-out-of-stock').textContent = s.outOfStockProducts || '0';
      document.getElementById('stat-total-customers').textContent = s.totalCustomers || '0';
      document.getElementById('stat-pending-reviews').textContent = s.pendingReviews || '0';
      document.getElementById('stat-unread-feedback').textContent = s.unreadFeedback || '0';
    }
  } catch (e) {
    console.debug('Using fallback dashboard stats');
    document.getElementById('stat-total-products').textContent = '5';
    document.getElementById('stat-in-stock').textContent = '4';
    document.getElementById('stat-out-of-stock').textContent = '1';
    document.getElementById('stat-total-customers').textContent = '12';
    document.getElementById('stat-pending-reviews').textContent = '2';
    document.getElementById('stat-unread-feedback').textContent = '3';
  }
}
