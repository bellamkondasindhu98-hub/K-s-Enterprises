/**
 * Admin Feedback & Inquiry Management Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
  if (!adminAuthService.requireAdminAuth()) return;

  const tableBody = document.getElementById('feedback-table-body');
  const btnFilterAll = document.getElementById('btn-filter-all');
  const btnFilterUnread = document.getElementById('btn-filter-unread');
  let allFeedback = [];
  let currentFilter = 'all';

  async function loadFeedback() {
    try {
      const response = await adminManagementService.getAllFeedback();
      allFeedback = response.data || [];
      renderFilteredFeedback();
    } catch (err) {
      console.error('Failed to load feedback:', err);
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--admin-danger); padding: 2rem;">
            Failed to load customer feedback.
          </td>
        </tr>
      `;
    }
  }

  function renderFilteredFeedback() {
    let items = allFeedback;
    if (currentFilter === 'unread') {
      items = allFeedback.filter(f => !f.isRead);
    }

    if (!items || items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">
            No feedback entries found.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items.map(f => {
      const statusBadge = f.isRead
        ? '<span class="status-badge status-in-stock">Read</span>'
        : '<span class="status-badge" style="background: rgba(234, 88, 12, 0.15); color: var(--admin-warning);">New</span>';

      const dateStr = f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A';

      const stars = f.rating ? '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating) : 'N/A';

      return `
        <tr style="${!f.isRead ? 'background-color: rgba(248, 250, 252, 0.6);' : ''}">
          <td>${statusBadge}</td>
          <td style="font-weight: 600; color: var(--admin-text-main);">${escapeHtml(f.name)}</td>
          <td>
            <div style="font-size: 0.85rem;">📧 ${escapeHtml(f.email || '-')}</div>
            <div style="font-size: 0.85rem; color: var(--admin-text-muted);">📞 ${escapeHtml(f.phone || '-')}</div>
          </td>
          <td style="max-width: 320px;">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(f.subject || 'General Inquiry')}</div>
            <div style="font-size: 0.85rem; color: var(--admin-text-muted); line-height: 1.4;">${escapeHtml(f.message)}</div>
          </td>
          <td style="color: #F59E0B; font-size: 0.9rem;">${stars}</td>
          <td style="font-size: 0.85rem; color: var(--admin-text-muted);">${dateStr}</td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              ${!f.isRead ? `
                <button class="btn-admin btn-admin-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="markAsRead(${f.id})">
                  Mark Read
                </button>
              ` : ''}
              <button class="btn-admin btn-admin-danger" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="deleteFeedback(${f.id})">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.markAsRead = async (id) => {
    try {
      await adminManagementService.markFeedbackRead(id);
      const item = allFeedback.find(f => f.id === id);
      if (item) item.isRead = true;
      renderFilteredFeedback();
    } catch (err) {
      alert('Failed to mark feedback as read: ' + (err.message || 'Unknown error'));
    }
  };

  window.deleteFeedback = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback entry?')) return;
    try {
      await adminManagementService.deleteFeedback(id);
      allFeedback = allFeedback.filter(f => f.id !== id);
      renderFilteredFeedback();
    } catch (err) {
      alert('Failed to delete feedback: ' + (err.message || 'Unknown error'));
    }
  };

  if (btnFilterAll) {
    btnFilterAll.addEventListener('click', () => {
      currentFilter = 'all';
      btnFilterAll.classList.add('btn-admin-primary');
      btnFilterAll.classList.remove('btn-admin-secondary');
      btnFilterUnread.classList.add('btn-admin-secondary');
      btnFilterUnread.classList.remove('btn-admin-primary');
      renderFilteredFeedback();
    });
  }

  if (btnFilterUnread) {
    btnFilterUnread.addEventListener('click', () => {
      currentFilter = 'unread';
      btnFilterUnread.classList.add('btn-admin-primary');
      btnFilterUnread.classList.remove('btn-admin-secondary');
      btnFilterAll.classList.add('btn-admin-secondary');
      btnFilterAll.classList.remove('btn-admin-primary');
      renderFilteredFeedback();
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

  await loadFeedback();
});
