/**
 * K's Enterprises - Reusable Footer Component
 */
function renderFooter(targetElementId = 'app-footer') {
  const container = document.getElementById(targetElementId);
  if (!container) return;

  const isSubpage = window.location.pathname.includes('/pages/');
  const rootPath = isSubpage ? '../../' : './';

  const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${rootPath}pages/home/index.html">
              <img src="${rootPath}assets/logos/ks-enterprises-logo.svg" alt="K's Enterprises" class="footer-logo">
            </a>
            <p class="footer-tagline" data-i18n="footer.tagline">
              Quality Fish Feed for Better Growth and Sustainable Aquaculture.
            </p>
            <div style="font-size: 0.85rem; color: var(--footer-muted);">
              <strong>GST No:</strong> <span class="company-gst-placeholder">[GST_NUMBER_PLACEHOLDER]</span>
            </div>
          </div>

          <div>
            <h4 class="footer-heading" data-i18n="footer.quickLinks">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="${rootPath}pages/home/index.html" class="footer-link" data-i18n="nav.home">Home</a></li>
              <li><a href="${rootPath}pages/products/index.html" class="footer-link" data-i18n="nav.products">Products</a></li>
              <li><a href="${rootPath}pages/company-profile/index.html" class="footer-link" data-i18n="nav.company">Company Profile</a></li>
              <li><a href="${rootPath}pages/why-choose-us/index.html" class="footer-link" data-i18n="nav.whyChooseUs">Why Choose Us</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-heading">Support</h4>
            <ul class="footer-links">
              <li><a href="${rootPath}pages/help-center/index.html" class="footer-link" data-i18n="nav.helpCenter">Help Center & FAQs</a></li>
              <li><a href="${rootPath}pages/feedback/index.html" class="footer-link" data-i18n="nav.feedback">Submit Feedback</a></li>
              <li><a href="${rootPath}pages/wishlist/index.html" class="footer-link" data-i18n="nav.wishlist">My Wishlist</a></li>
              <li><a href="${rootPath}../admin-dashboard/index.html" class="footer-link">Admin Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-heading" data-i18n="footer.contact">Contact & Orders</h4>
            <ul class="footer-links">
              <li>📍 <span class="company-address-placeholder">[COMPANY_ADDRESS_PLACEHOLDER]</span></li>
              <li>📞 <a href="tel:[PHONE_NUMBER_PLACEHOLDER]" class="footer-link company-phone-placeholder">[PHONE_NUMBER_PLACEHOLDER]</a></li>
              <li>✉️ <a href="mailto:[EMAIL_ADDRESS_PLACEHOLDER]" class="footer-link company-email-placeholder">[EMAIL_ADDRESS_PLACEHOLDER]</a></li>
              <li>💬 <a href="javascript:void(0)" onclick="whatsappService.openGeneralInquiryChat()" class="footer-link" style="color: #4ade80; font-weight: 600;">Chat on WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} K's Enterprises. <span data-i18n="footer.copyright">All Rights Reserved.</span></p>
          <p>Fish Feed Formulation & Aquaculture Solutions</p>
        </div>
      </div>
    </footer>
  `;

  container.innerHTML = footerHtml;
  if (window.i18nService) {
    window.i18nService.applyTranslations();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderFooter();
});
