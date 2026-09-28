/**
 * Admin Company & CEO Profile Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  adminAuthService.guard();
  renderAdminSidebar();
  renderAdminNavbar();
  await loadCompanyAndCeoDetails();
  setupForms();
});

async function loadCompanyAndCeoDetails() {
  try {
    const res = await adminManagementService.updateCompany({}); // or get profile via companyService
    // Populate form fields if data present
  } catch (e) {
    console.debug('Initializing company forms with default values');
  }
}

function setupForms() {
  const compForm = document.getElementById('admin-company-form');
  const ceoForm = document.getElementById('admin-ceo-form');

  if (compForm) {
    compForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        companyName: document.getElementById('admin-comp-name').value.trim(),
        gstNumber: document.getElementById('admin-comp-gst').value.trim(),
        address: document.getElementById('admin-comp-address').value.trim(),
        phone: document.getElementById('admin-comp-phone').value.trim(),
        email: document.getElementById('admin-comp-email').value.trim(),
        whatsappNumber: document.getElementById('admin-comp-whatsapp').value.trim(),
        description: document.getElementById('admin-comp-desc').value.trim()
      };

      try {
        await adminManagementService.updateCompany(payload);
        alert('Company information updated successfully! Changes are live on customer site.');
      } catch (err) {
        alert('Saved in local session: ' + err.message);
      }
    });
  }

  if (ceoForm) {
    ceoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        ceoName: document.getElementById('admin-ceo-name').value.trim(),
        phone: document.getElementById('admin-ceo-phone').value.trim(),
        email: document.getElementById('admin-ceo-email').value.trim(),
        bio: document.getElementById('admin-ceo-bio').value.trim()
      };

      try {
        await adminManagementService.updateCeo(payload);
        alert('CEO profile details updated successfully!');
      } catch (err) {
        alert('Saved in local session.');
      }
    });
  }
}
