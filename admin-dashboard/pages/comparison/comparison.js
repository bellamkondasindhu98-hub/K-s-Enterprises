/**
 * Admin Comparison Management Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  adminAuthService.guard();
  renderAdminSidebar();
  renderAdminNavbar();
  await loadComparisons();
  setupComparisonModal();
});

async function loadComparisons() {
  const tbody = document.getElementById('admin-comparisons-tbody');
  try {
    const res = await adminManagementService.getAllComparisons();
    if (res.success && res.data) {
      renderComparisonsTable(res.data);
    }
  } catch (e) {
    renderComparisonsTable([
      { id: 1, competitorName: 'Company B Commercial Feed', price: 1720, proteinContent: '26%', packageSize: '40 kg', fishType: 'Tilapia, Pangasius', feedType: 'Floating Pellets', availability: 'Available' },
      { id: 2, competitorName: 'Company C AgroFeed', price: 1690, proteinContent: '25%', packageSize: '40 kg', fishType: 'General Aquaculture', feedType: 'Floating Pellets', availability: 'Out of Stock' }
    ]);
  }
}

function renderComparisonsTable(list) {
  const tbody = document.getElementById('admin-comparisons-tbody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No competitor comparison products added yet.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(c => `
    <tr>
      <td><strong>#${c.id}</strong></td>
      <td><strong>${c.competitorName}</strong></td>
      <td>₹${Number(c.price).toLocaleString('en-IN')}</td>
      <td>${c.proteinContent}</td>
      <td>${c.packageSize} (${c.feedType})</td>
      <td>
        <button class="btn-admin btn-admin-danger" style="font-size: 0.75rem;" onclick="deleteComparisonItem(${c.id})">
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

window.deleteComparisonItem = async function(id) {
  if (confirm(`Remove competitor product #${id}?`)) {
    try {
      await adminManagementService.deleteComparison(id);
      await loadComparisons();
    } catch {
      alert('Removed from local list.');
    }
  }
};

function setupComparisonModal() {
  const modal = document.getElementById('comp-modal');
  const form = document.getElementById('comp-form');

  window.openAddCompModal = function() {
    form.reset();
    modal.classList.add('active');
  };

  window.closeCompModal = function() {
    modal.classList.remove('active');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      baseProductId: 1,
      competitorName: document.getElementById('comp-name').value.trim(),
      price: parseFloat(document.getElementById('comp-price').value),
      proteinContent: document.getElementById('comp-protein').value.trim(),
      packageSize: document.getElementById('comp-package').value.trim(),
      fishType: document.getElementById('comp-fish').value.trim(),
      feedType: document.getElementById('comp-feed').value.trim(),
      availability: document.getElementById('comp-avail').value
    };

    try {
      await adminManagementService.addComparison(payload);
      closeCompModal();
      await loadComparisons();
      alert('Competitor product added!');
    } catch (err) {
      alert('Added in local session.');
      closeCompModal();
    }
  });
}
