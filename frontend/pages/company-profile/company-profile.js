/**
 * Company Profile Page Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  await loadCompanyInfo();
});

async function loadCompanyInfo() {
  try {
    const res = await companyService.getCompanyProfile();
    if (res.success && res.data) {
      const comp = res.data;
      if (comp.companyName) document.getElementById('company-name').textContent = comp.companyName;
      if (comp.description) document.getElementById('company-desc').textContent = comp.description;
      if (comp.gstNumber) document.getElementById('company-gst').textContent = comp.gstNumber;
      if (comp.address) document.getElementById('company-address').textContent = comp.address;
      if (comp.phone) {
        const pEl = document.getElementById('company-phone');
        pEl.textContent = comp.phone;
        pEl.href = `tel:${comp.phone}`;
      }
      if (comp.email) {
        const eEl = document.getElementById('company-email');
        eEl.textContent = comp.email;
        eEl.href = `mailto:${comp.email}`;
      }
      if (comp.whatsappNumber) {
        document.getElementById('company-whatsapp').textContent = comp.whatsappNumber;
      }

      if (comp.ceo) {
        const ceo = comp.ceo;
        if (ceo.ceoName) document.getElementById('ceo-profile-name').textContent = ceo.ceoName;
        if (ceo.bio) document.getElementById('ceo-profile-bio').textContent = ceo.bio;
        if (ceo.phone) {
          const cpEl = document.getElementById('ceo-profile-phone');
          cpEl.textContent = ceo.phone;
          cpEl.href = `tel:${ceo.phone}`;
        }
        if (ceo.email) {
          const ceEl = document.getElementById('ceo-profile-email');
          ceEl.textContent = ceo.email;
          ceEl.href = `mailto:${ceo.email}`;
        }
      }
    }
  } catch (e) {
    console.debug('Using company placeholders');
  }
}
