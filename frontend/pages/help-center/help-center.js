/**
 * Help Center Page Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  await loadSupportContacts();
  await loadFaqs();
});

async function loadSupportContacts() {
  try {
    const res = await companyService.getCompanyProfile();
    if (res.success && res.data) {
      const comp = res.data;
      if (comp.phone) {
        const pEl = document.getElementById('help-phone-link');
        pEl.textContent = comp.phone;
        pEl.href = `tel:${comp.phone}`;
      }
      if (comp.email) {
        const eEl = document.getElementById('help-email-link');
        eEl.textContent = comp.email;
        eEl.href = `mailto:${comp.email}`;
      }
      if (comp.whatsappNumber) {
        const wEl = document.getElementById('help-whatsapp-link');
        wEl.textContent = comp.whatsappNumber;
      }
    }
  } catch (e) {
    console.debug('Using support contact placeholders');
  }
}

async function loadFaqs() {
  const container = document.getElementById('faqs-accordion-container');
  try {
    const res = await companyService.getWebsiteContent('faqs');
    if (res.success && res.data) {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data.items && data.items.length > 0) {
        renderFaqItems(data.items);
        return;
      }
    }
  } catch (e) {
    console.debug('Using fallback FAQs');
  }

  renderFaqItems([
    {
      question: "How do I place an order for K's Enterprises fish feed?",
      answer: "Click the 'Order Through WhatsApp' button on any product page. This will automatically open WhatsApp with your product details filled in, and our team will coordinate the order directly with you."
    },
    {
      question: "What is the minimum order quantity?",
      answer: "Order quantities can be discussed directly with our sales team via WhatsApp or phone based on your pond requirements and location."
    },
    {
      question: "How do I select the right pellet size for my fish?",
      answer: "For nursery fry, use our Starter Crumbles (0.5mm - 1mm). For juvenile fish up to 100g, use 2mm - 3mm pellets. For adult grow-out fish above 200g, use 4mm - 5mm floating or sinking pellets."
    },
    {
      question: "Do you deliver to farm locations?",
      answer: "Delivery arrangements and logistics are coordinated based on your farm location when you connect with us via WhatsApp or phone."
    }
  ]);
}

function renderFaqItems(items) {
  const container = document.getElementById('faqs-accordion-container');
  container.innerHTML = items.map((faq, idx) => `
    <div class="faq-item">
      <div class="faq-question" onclick="toggleFaq(${idx})">
        <span>${faq.question}</span>
        <span id="faq-icon-${idx}">▼</span>
      </div>
      <div class="faq-answer" id="faq-ans-${idx}" style="${idx === 0 ? 'display: block;' : 'display: none;'}">
        ${faq.answer}
      </div>
    </div>
  `).join('');
}

window.toggleFaq = function(idx) {
  const ans = document.getElementById(`faq-ans-${idx}`);
  const icon = document.getElementById(`faq-icon-${idx}`);
  if (ans.style.display === 'none') {
    ans.style.display = 'block';
    icon.textContent = '▲';
  } else {
    ans.style.display = 'none';
    icon.textContent = '▼';
  }
};
