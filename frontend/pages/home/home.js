/**
 * Home Page Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  loadHeroContent();
  loadFeaturedProducts();
  loadCeoSection();
  loadWhyChooseUsSection();
});

async function loadHeroContent() {
  try {
    const res = await companyService.getWebsiteContent('hero');
    if (res.success && res.data) {
      const heroData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (heroData.heading) document.getElementById('hero-heading').textContent = heroData.heading;
      if (heroData.subheading) document.getElementById('hero-subheading').textContent = heroData.subheading;
      if (heroData.ctaText) document.getElementById('hero-cta-btn').textContent = heroData.ctaText;
    }
  } catch (e) {
    console.debug('Using default hero text fallback');
  }
}

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  try {
    const res = await productService.getFeaturedProducts();
    if (res.success && res.data && res.data.length > 0) {
      renderProductGrid(res.data, 'featured-products-container', '../../');
    } else {
      // Fallback: fetch all active products
      const allRes = await productService.getAllProducts();
      if (allRes.success && allRes.data) {
        renderProductGrid(allRes.data.slice(0, 4), 'featured-products-container', '../../');
      }
    }
  } catch (e) {
    console.warn('Failed to load featured products from API:', e);
    // Display initial placeholder products if backend is offline
    renderProductGrid([
      {
        id: 1,
        name: 'AquaGrow Floating Feed 28%',
        slug: 'aquagrow-floating-feed-28',
        categoryName: 'Floating Pellets',
        price: 1650,
        description: 'Premium extruded floating pellets engineered for rapid growth and minimal water pollution.',
        packageSize: '40 kg Bag',
        feedType: 'Floating Pellets',
        suitableFish: 'Tilapia, Pangasius, Rohu',
        availability: 'AVAILABLE',
        primaryImage: '/assets/images/product-floating-feed-28.svg'
      },
      {
        id: 2,
        name: 'AquaGrow Floating Feed 32% High-Protein',
        slug: 'aquagrow-floating-feed-32',
        categoryName: 'Floating Pellets',
        price: 1950,
        description: 'High-protein floating feed formulated with marine fish meal for maximum weight gain.',
        packageSize: '40 kg Bag',
        feedType: 'Floating Pellets',
        suitableFish: 'Tilapia, Seabass, Murrel',
        availability: 'AVAILABLE',
        primaryImage: '/assets/images/product-floating-feed-32.svg'
      },
      {
        id: 3,
        name: 'BottomPro Sinking Feed 30%',
        slug: 'bottompro-sinking-feed-30',
        categoryName: 'Sinking Pellets',
        price: 1800,
        description: 'Specially formulated sinking pellets that remain intact underwater for bottom foragers.',
        packageSize: '50 kg Bag',
        feedType: 'Sinking Pellets',
        suitableFish: 'Catla, Carp, Catfish',
        availability: 'AVAILABLE',
        primaryImage: '/assets/images/product-sinking-feed-30.svg'
      }
    ], 'featured-products-container', '../../');
  }
}

async function loadCeoSection() {
  try {
    const res = await companyService.getCeoProfile();
    if (res.success && res.data) {
      const ceo = res.data;
      if (ceo.ceoName) document.getElementById('ceo-name').textContent = ceo.ceoName;
      if (ceo.bio) document.getElementById('ceo-bio').textContent = ceo.bio;
      if (ceo.phone) {
        const phoneEl = document.getElementById('ceo-phone');
        phoneEl.textContent = ceo.phone;
        phoneEl.href = `tel:${ceo.phone}`;
      }
      if (ceo.email) {
        const emailEl = document.getElementById('ceo-email');
        emailEl.textContent = ceo.email;
        emailEl.href = `mailto:${ceo.email}`;
      }
      if (ceo.ceoImage) {
        document.getElementById('ceo-image').src = `../../${ceo.ceoImage.replace(/^\//, '')}`;
      }
    }
  } catch (e) {
    console.debug('Using CEO placeholders');
  }
}

async function loadWhyChooseUsSection() {
  const container = document.getElementById('why-choose-us-grid');
  if (!container) return;

  try {
    const res = await companyService.getWebsiteContent('why_choose_us');
    if (res.success && res.data) {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data.items && data.items.length > 0) {
        container.innerHTML = data.items.map(item => `
          <div class="card" style="padding: 1.5rem; text-align: center;">
            <div style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.75rem;">✓</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">${item.title}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">${item.description}</p>
          </div>
        `).join('');
      }
    }
  } catch (e) {
    console.debug('Using fallback why choose us content');
  }
}
