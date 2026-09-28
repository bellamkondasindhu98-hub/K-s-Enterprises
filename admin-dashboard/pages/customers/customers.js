/**
 * Admin Customers Management Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
  if (!adminAuthService.requireAdminAuth()) return;

  const tableBody = document.getElementById('customers-table-body');
  const searchInput = document.getElementById('customer-search-input');
  let allCustomers = [];

  async function loadCustomers() {
    try {
      const response = await adminManagementService.getCustomers();
      allCustomers = response.data || [];
      renderCustomers(allCustomers);
    } catch (err) {
      console.error('Failed to load customers:', err);
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--admin-danger); padding: 2rem;">
            Failed to load customers. Please check backend connection.
          </td>
        </tr>
      `;
    }
  }

  function renderCustomers(customers) {
    if (!customers || customers.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">
            No customers found.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = customers.map(c => {
      const regDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'N/A';

      const providerBadge = c.authProvider === 'GOOGLE'
        ? '<span class="status-badge" style="background: rgba(66, 133, 244, 0.15); color: #4285F4;">Google</span>'
        : '<span class="status-badge" style="background: rgba(100, 116, 139, 0.15); color: #64748B;">Local</span>';

      const location = [c.city, c.state].filter(Boolean).join(', ') || '-';

      return `
        <tr>
          <td style="font-weight: 600; color: var(--admin-text-muted);">#${c.id}</td>
          <td style="font-weight: 600; color: var(--admin-text-main);">${escapeHtml(c.fullName || c.name || 'User')}</td>
          <td>${escapeHtml(c.email || '-')}</td>
          <td>${escapeHtml(c.phone || '-')}</td>
          <td>${escapeHtml(location)}</td>
          <td>${providerBadge}</td>
          <td style="font-size: 0.85rem; color: var(--admin-text-muted);">${regDate}</td>
        </tr>
      `;
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        renderCustomers(allCustomers);
        return;
      }

      const filtered = allCustomers.filter(c => {
        const name = (c.fullName || c.name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        const city = (c.city || '').toLowerCase();
        return name.includes(query) || email.includes(query) || phone.includes(query) || city.includes(query);
      });
      renderCustomers(filtered);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  await loadCustomers();
});
