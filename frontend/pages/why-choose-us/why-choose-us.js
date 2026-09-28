/**
 * Why Choose Us Page Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  await loadPillars();
});

async function loadPillars() {
  const container = document.getElementById('pillars-grid');
  try {
    const res = await companyService.getWebsiteContent('why_choose_us');
    if (res.success && res.data) {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data.items && data.items.length > 0) {
        renderPillars(data.items);
        return;
      }
    }
  } catch (e) {
    console.debug('Using fallback why choose us');
  }

  renderPillars([
    { title: 'Quality Products', description: 'Formulated with tested marine ingredients, balanced amino acids, and verified protein concentrations.' },
    { title: 'Reliable Service', description: 'Prompt order coordination, clear communication, and dedicated farmer assistance via WhatsApp.' },
    { title: 'Product Variety', description: 'Complete aquaculture solutions spanning fry starter crumbles, floating feeds, sinking feeds, to broodstock boosters.' },
    { title: 'Competitive Pricing', description: 'Transparent and direct pricing structured to maximize aquaculture farmer profitability.' },
    { title: 'Customer Support', description: 'Responsive communication, seasonal guidance, and feed recommendations tailored to fish species.' },
    { title: 'Trusted Service', description: 'Strict quality control, consistent pellet water stability, and hygienic packaging across all batches.' }
  ]);
}

function renderPillars(items) {
  const container = document.getElementById('pillars-grid');
  const icons = ['🌟', '🤝', '🐟', '💰', '📞', '🛡️'];

  container.innerHTML = items.map((item, idx) => `
    <div class="pillar-card">
      <div class="pillar-icon">${icons[idx % icons.length]}</div>
      <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">${item.title}</h3>
      <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">${item.description}</p>
    </div>
  `).join('');
}
