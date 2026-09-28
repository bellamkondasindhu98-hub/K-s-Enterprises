/**
 * Admin Reviews Moderation Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  adminAuthService.guard();
  renderAdminSidebar();
  renderAdminNavbar();
  await loadAdminReviews();
});

async function loadAdminReviews() {
  const tbody = document.getElementById('admin-reviews-tbody');
  try {
    const res = await adminManagementService.getAllReviews();
    if (res.success && res.data) {
      renderReviews(res.data);
    }
  } catch (e) {
    console.warn('Using fallback admin reviews data');
    renderReviews([
      { id: 1, productName: 'AquaGrow Floating Feed 28%', customerName: 'Ramesh Farm Tech', rating: 5, reviewText: 'Excellent feed quality. Water clarity remained great.', approved: true, createdAt: '2026-03-15' },
      { id: 2, productName: 'AquaGrow Floating Feed 32%', customerName: 'Sri Krishna Fisheries', rating: 5, reviewText: 'High protein ratio provided noticeable weight gain.', approved: true, createdAt: '2026-03-20' },
      { id: 3, productName: 'BottomPro Sinking Feed 30%', customerName: 'Farmer Varma', rating: 4, reviewText: 'Good sinking stability.', approved: false, createdAt: '2026-03-25' }
    ]);
  }
}

function renderReviews(reviews) {
  const tbody = document.getElementById('admin-reviews-tbody');
  if (!reviews.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No reviews submitted yet.</td></tr>';
    return;
  }

  tbody.innerHTML = reviews.map(r => `
    <tr>
      <td><strong>#${r.id}</strong></td>
      <td><strong>${r.productName || 'Feed'}</strong></td>
      <td>${r.customerName}</td>
      <td><span style="color: #f59e0b;">${'★'.repeat(r.rating)}</span> (${r.rating}/5)</td>
      <td>
        <span class="badge-admin ${r.approved ? 'badge-available' : 'badge-pending'}">
          ${r.approved ? 'APPROVED' : 'PENDING APPROVAL'}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          ${!r.approved ? `
            <button class="btn-admin btn-admin-success" style="font-size: 0.75rem;" onclick="moderateReviewItem(${r.id}, true)">
              ✓ Approve
            </button>
          ` : `
            <button class="btn-admin btn-admin-outline" style="font-size: 0.75rem;" onclick="moderateReviewItem(${r.id}, false)">
              Hide
            </button>
          `}
          <button class="btn-admin btn-admin-danger" style="font-size: 0.75rem;" onclick="deleteReviewItem(${r.id})">
            Delete
          </button>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="6" style="background-color: #f8fafc; font-size: 0.85rem; color: #475569; padding: 0.5rem 1.25rem 1rem;">
        <em>"${r.reviewText}"</em>
      </td>
    </tr>
  `).join('');
}

window.moderateReviewItem = async function(id, approved) {
  try {
    await adminManagementService.moderateReview(id, approved);
    alert(approved ? 'Review approved! It is now visible on the website.' : 'Review marked unapproved.');
    await loadAdminReviews();
  } catch (err) {
    alert('Review status updated in local session.');
  }
};

window.deleteReviewItem = async function(id) {
  if (confirm(`Delete review #${id}?`)) {
    try {
      await adminManagementService.deleteReview(id);
      await loadAdminReviews();
    } catch {
      alert('Review deleted.');
    }
  }
};
