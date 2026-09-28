/**
 * Products Page Controller
 */
let allProducts = [];
let selectedCategoryId = null;
let selectedAvailability = 'ALL';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam) {
    selectedCategoryId = parseInt(catParam, 10);
  }

  await loadCategories();
  await loadProducts();

  setupFilterListeners();
});

async function loadCategories() {
  const container = document.getElementById('category-filter-list');
  if (!container) return;

  try {
    const res = await productService.getCategories();
    if (res.success && res.data) {
      let html = `
        <label class="filter-item">
          <input type="radio" name="category" value="ALL" ${!selectedCategoryId ? 'checked' : ''} onchange="filterCategory(null)">
          <span>All Categories</span>
        </label>
      `;
      res.data.forEach(cat => {
        html += `
          <label class="filter-item">
            <input type="radio" name="category" value="${cat.id}" ${selectedCategoryId === cat.id ? 'checked' : ''} onchange="filterCategory(${cat.id})">
            <span>${cat.name} (${cat.productCount})</span>
          </label>
        `;
      });
      container.innerHTML = html;
    }
  } catch (e) {
    console.debug('Using fallback category list');
  }
}

async function loadProducts() {
  try {
    const res = await productService.getAllProducts(selectedCategoryId);
    if (res.success && res.data) {
      allProducts = res.data;
      renderFilteredProducts();
    }
  } catch (e) {
    console.warn('API unavailable, using initial catalog data fallback:', e);
    allProducts = [
      {
        id: 1,
        categoryId: 1,
        name: 'AquaGrow Floating Feed 28%',
        slug: 'aquagrow-floating-feed-28',
        categoryName: 'Floating Pellets',
        price: 1650,
        description: 'Premium extruded floating pellets engineered for rapid growth and minimal water pollution. Perfect for commercial aquaculture farms.',
        packageSize: '40 kg Bag',
        feedType: 'Floating Pellets',
        suitableFish: 'Tilapia, Pangasius, Rohu, Catla',
        availability: 'AVAILABLE',
        primaryImage: '/assets/images/product-floating-feed-28.svg'
      },
      {
        id: 2,
        categoryId: 1,
        name: 'AquaGrow Floating Feed 32% High-Protein',
        slug: 'aquagrow-floating-feed-32',
        categoryName: 'Floating Pellets',
        price: 1950,
        description: 'High-protein floating feed formulated with marine fish meal and fortified amino acids for maximum weight gain.',
        packageSize: '40 kg Bag',
        feedType: 'Floating Pellets',
        suitableFish: 'Tilapia, Seabass, Murrel, Pangasius',
        availability: 'AVAILABLE',
        primaryImage: '/assets/images/product-floating-feed-32.svg'
      },
      {
        id: 3,
        categoryId: 2,
        name: 'BottomPro Sinking Feed 30%',
        slug: 'bottompro-sinking-feed-30',
        categoryName: 'Sinking Pellets',
        price: 1800,
        description: 'Specially formulated sinking pellets that remain intact underwater, preventing nutrient leaching for bottom foragers.',
        packageSize: '50 kg Bag',
        feedType: 'Sinking Pellets',
        suitableFish: 'Catla, Mrigal, Carp, Catfish',
        availability: 'AVAILABLE',
        primaryImage: '/assets/images/product-sinking-feed-30.svg'
      },
      {
        id: 4,
        categoryId: 3,
        name: 'Nursery Starter Micro-Crumbles 40%',
        slug: 'nursery-starter-micro-crumbles-40',
        categoryName: 'Starter Crumbles',
        price: 2400,
        description: 'Ultra-fine micro-crumbles for hatcheries and nursery ponds. Packed with digestible proteins and immunity boosters.',
        packageSize: '20 kg Bag',
        feedType: 'Starter Crumbles',
        suitableFish: 'Fry, Fingerlings, All Species Nursery',
        availability: 'AVAILABLE',
        primaryImage: '/assets/images/product-starter-crumbles.svg'
      },
      {
        id: 5,
        categoryId: 4,
        name: 'Breeder Gold Broodstock Booster 38%',
        slug: 'breeder-gold-broodstock-booster-38',
        categoryName: 'Broodstock Special',
        price: 3100,
        description: 'Specialized reproductive nutritional feed fortified with Omega-3, Astaxanthin, and minerals for superior egg viability.',
        packageSize: '25 kg Bag',
        feedType: 'Broodstock Special',
        suitableFish: 'Broodstock Fish, Carp, Tilapia, Seabass',
        availability: 'OUT_OF_STOCK',
        primaryImage: '/assets/images/product-broodstock.svg'
      }
    ];
    renderFilteredProducts();
  }
}

function renderFilteredProducts() {
  let filtered = [...allProducts];

  if (selectedCategoryId) {
    filtered = filtered.filter(p => p.categoryId === selectedCategoryId);
  }

  if (selectedAvailability !== 'ALL') {
    filtered = filtered.filter(p => p.availability === selectedAvailability);
  }

  const countEl = document.getElementById('products-count');
  if (countEl) countEl.textContent = `${filtered.length} products found`;

  renderProductGrid(filtered, 'products-grid-container', '../../');
}

window.filterCategory = function(catId) {
  selectedCategoryId = catId;
  loadProducts();
};

window.filterAvailability = function(status) {
  selectedAvailability = status;
  renderFilteredProducts();
};

function setupFilterListeners() {
  const searchBox = document.getElementById('product-keyword-filter');
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase().trim();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(keyword) ||
        (p.description && p.description.toLowerCase().includes(keyword)) ||
        (p.feedType && p.feedType.toLowerCase().includes(keyword)) ||
        (p.suitableFish && p.suitableFish.toLowerCase().includes(keyword))
      );
      renderProductGrid(filtered, 'products-grid-container', '../../');
    });
  }
}
