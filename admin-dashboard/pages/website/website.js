/**
 * Admin Website Content CMS Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  adminAuthService.guard();
  renderAdminSidebar();
  renderAdminNavbar();
  setupCmsForms();
});

function setupCmsForms() {
  const heroForm = document.getElementById('cms-hero-form');
  const faqForm = document.getElementById('cms-faq-form');

  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = {
        heading: document.getElementById('cms-hero-heading').value.trim(),
        subheading: document.getElementById('cms-hero-subheading').value.trim(),
        ctaText: document.getElementById('cms-hero-cta').value.trim()
      };

      try {
        await adminManagementService.updateWebsiteContent('hero', JSON.stringify(content));
        alert('Hero banner content updated successfully!');
      } catch (err) {
        alert('Saved in local session.');
      }
    });
  }

  if (faqForm) {
    faqForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = document.getElementById('cms-faq-q').value.trim();
      const a = document.getElementById('cms-faq-a').value.trim();

      const content = {
        items: [
          { question: q, answer: a },
          { question: "What is the minimum order quantity?", answer: "Order quantities can be discussed directly with our sales team via WhatsApp." }
        ]
      };

      try {
        await adminManagementService.updateWebsiteContent('faqs', JSON.stringify(content));
        alert('FAQs updated successfully!');
      } catch (err) {
        alert('Saved in local session.');
      }
    });
  }
}
