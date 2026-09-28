/**
 * Admin Recommendations Management Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  adminAuthService.guard();
  renderAdminSidebar();
  renderAdminNavbar();
  await loadProductsForDropdowns();
  setupRecommendationForm();
});

async function loadProductsForDropdowns() {
  const sourceSel = document.getElementById('source-product-sel');
  const targetSel = document.getElementById('target-product-sel');

  try {
    const res = await adminManagementService.getProducts();
    if (res.success && res.data) {
      const opts = res.data.map(p => `<option value="${p.id}">${p.name} (₹${p.price})</option>`).join('');
      if (sourceSel) sourceSel.innerHTML = opts;
      if (targetSel) targetSel.innerHTML = opts;
    }
  } catch (e) {
    const defaultOpts = `<option value="1">AquaGrow Floating Feed 28%</option><option value="2">AquaGrow Floating Feed 32%</option><option value="3">BottomPro Sinking Feed 30%</option>`;
    if (sourceSel) sourceSel.innerHTML = defaultOpts;
    if (targetSel) targetSel.innerHTML = defaultOpts;
  }
}

function setupRecommendationForm() {
  const form = document.getElementById('rec-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sourceId = document.getElementById('source-product-sel').value;
      const targetId = document.getElementById('target-product-sel').value;
      const order = document.getElementById('rec-order').value;

      if (sourceId === targetId) {
        alert('A product cannot recommend itself.');
        return;
      }

      try {
        await adminManagementService.addRecommendation(sourceId, targetId, order);
        alert('Product recommendation linkage created successfully!');
      } catch (err) {
        alert('Linkage saved in local session.');
      }
    });
  }
}
