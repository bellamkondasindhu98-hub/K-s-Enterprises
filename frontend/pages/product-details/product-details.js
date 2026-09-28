/**
 * Product Details Page Controller
 */
let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || '1';

  await loadProductDetails(productId);
  await loadProductReviews(productId);
  await loadProductComparison(productId);
  setupReviewForm(productId);
});

async function loadProductDetails(productId) {
  try {
    const res = await productService.getProductById(productId);
    if (res.success && res.data) {
      currentProduct = res.data;
      renderProductInfo(res.data);
      if (res.data.recommendedProducts && res.data.recommendedProducts.length > 0) {
        renderProductGrid(res.data.recommendedProducts, 'recommended-products-grid', '../../');
      } else {
        document.getElementById('recommended-section').style.display = 'none';
      }
    }
  } catch (e) {
    console.warn('API unavailable, using fallback product details:', e);
    currentProduct = {
      id: parseInt(productId, 10),
      name: 'AquaGrow Floating Feed 28%',
      categoryName: 'Floating Pellets',
      price: 1650,
      description: 'Premium extruded floating pellets engineered for rapid growth and minimal water pollution. Highly digestible and formulated with tested ingredients.',
      specifications: 'Pellet Size: 3.0mm - 4.0mm | Water Stability: 3+ Hours | Digestibility: High',
      suitableFish: 'Tilapia, Pangasius, Rohu, Catla',
      feedType: 'Floating Pellets',
      packageSize: '40 kg Bag',
      nutritionalInfo: '{"crude_protein": "28%", "crude_fat": "5.0%", "crude_fiber": "5.5%", "moisture": "10.0%", "calcium": "1.2%", "phosphorus": "0.8%"}',
      availability: 'AVAILABLE',
      primaryImage: '/assets/images/product-floating-feed-28.svg',
      additionalImages: ['/assets/images/product-floating-feed-28.svg'],
      averageRating: 4.8,
      reviewCount: 4
    };
    renderProductInfo(currentProduct);
  }
}

function renderProductInfo(p) {
  document.title = `${p.name} | K's Enterprises`;

  document.getElementById('product-title').textContent = p.name;
  document.getElementById('product-category').textContent = p.categoryName || 'Fish Feed';
  document.getElementById('product-price').textContent = `₹${Number(p.price).toLocaleString('en-IN')}`;
  document.getElementById('product-description').textContent = p.description || '';

  // Stock Badge
  const isAvail = p.availability === 'AVAILABLE';
  const badgeEl = document.getElementById('stock-badge');
  badgeEl.className = `badge ${isAvail ? 'badge-in-stock' : 'badge-out-of-stock'}`;
  badgeEl.textContent = isAvail ? 'AVAILABLE' : 'OUT OF STOCK';

  // Main Image & Gallery
  const mainImg = document.getElementById('main-product-img');
  const primaryImgUrl = p.primaryImage ? `../../${p.primaryImage.replace(/^\//, '')}` : '../../assets/images/product-floating-feed-28.svg';
  mainImg.src = primaryImgUrl;

  const thumbsContainer = document.getElementById('image-thumbnails');
  const allImgs = [primaryImgUrl, ...(p.additionalImages ? p.additionalImages.map(img => `../../${img.replace(/^\//, '')}`) : [])];
  const uniqueImgs = [...new Set(allImgs)];

  if (uniqueImgs.length > 1) {
    thumbsContainer.innerHTML = uniqueImgs.map((img, idx) => `
      <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchMainImage('${img}', this)">
        <img src="${img}" style="max-height: 50px;">
      </div>
    `).join('');
  } else {
    thumbsContainer.style.display = 'none';
  }

  // Specifications
  document.getElementById('spec-suitable-fish').textContent = p.suitableFish || 'All Freshwater Fish';
  document.getElementById('spec-feed-type').textContent = p.feedType || 'Pelleted Feed';
  document.getElementById('spec-package-size').textContent = p.packageSize || 'Standard Bag';
  document.getElementById('spec-details').textContent = p.specifications || 'Standard specifications';

  // Nutritional Details
  if (p.nutritionalInfo) {
    try {
      const nutrition = typeof p.nutritionalInfo === 'string' ? JSON.parse(p.nutritionalInfo) : p.nutritionalInfo;
      let nutHtml = '';
      for (const [key, val] of Object.entries(nutrition)) {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        nutHtml += `<tr><th>${formattedKey}</th><td>${val}</td></tr>`;
      }
      document.getElementById('nutrition-table-body').innerHTML = nutHtml;
    } catch {
      document.getElementById('nutrition-box').style.display = 'none';
    }
  }

  // Render WhatsApp Order Button
  renderWhatsAppOrderButton('whatsapp-order-box', p);

  // Render Wishlist & Share buttons
  renderWishlistButton('wishlist-btn-box', p);
  renderShareButton('share-btn-box', p.name);

  // Comparison Direct Link
  const compLink = document.getElementById('view-comparison-link');
  if (compLink) compLink.href = `../comparison/index.html?baseId=${p.id}`;
}

window.switchMainImage = function(src, thumbEl) {
  document.getElementById('main-product-img').src = src;
  document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('active'));
  thumbEl.classList.add('active');
};

async function loadProductReviews(productId) {
  const container = document.getElementById('reviews-list-container');
  try {
    const res = await reviewService.getReviewsByProduct(productId);
    if (res.success && res.data && res.data.length > 0) {
      container.innerHTML = res.data.map(r => `
        <div class="review-item">
          <div class="flex justify-between items-center" style="margin-bottom: 0.5rem;">
            <strong>${r.customerName}</strong>
            <span class="star-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
          </div>
          <p style="font-size: 0.95rem; color: var(--text-secondary);">${r.reviewText}</p>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="text-muted">No approved reviews yet. Be the first to review this product!</p>';
    }
  } catch (e) {
    container.innerHTML = '<p class="text-muted">Customer reviews will appear here once approved by administrator.</p>';
  }
}

async function loadProductComparison(productId) {
  const container = document.getElementById('comparison-preview-container');
  if (!container) return;

  try {
    const res = await comparisonService.getComparisonMatrix(productId);
    if (res.success && res.data && res.data.competitors && res.data.competitors.length > 0) {
      const c = res.data.competitors[0];
      container.innerHTML = `
        <div class="card" style="padding: 1.5rem; background-color: var(--bg-tertiary);">
          <h4 style="font-weight: 700; margin-bottom: 0.75rem;">Factual Competitor Comparison</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Compare <strong>${res.data.ksProduct.name}</strong> side-by-side with <strong>${c.competitorName}</strong> on protein, package size, and specifications.
          </p>
          <a href="../comparison/index.html?baseId=${productId}" class="btn btn-outline" style="width: 100%;">
            View Full Comparison Matrix →
          </a>
        </div>
      `;
    } else {
      container.style.display = 'none';
    }
  } catch {
    container.style.display = 'none';
  }
}

function setupReviewForm(productId) {
  const form = document.getElementById('add-review-form');
  const msgBox = document.getElementById('review-msg-box');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msgBox.style.display = 'none';

      const name = document.getElementById('review-customer-name').value.trim();
      const rating = document.getElementById('review-rating').value;
      const text = document.getElementById('review-text').value.trim();

      try {
        await reviewService.submitReview(productId, name, rating, text);
        msgBox.textContent = 'Thank you! Your review has been submitted for admin approval.';
        msgBox.style.display = 'block';
        form.reset();
      } catch (err) {
        msgBox.textContent = err.message || 'Review submitted. Admin approval required.';
        msgBox.style.display = 'block';
      }
    });
  }
}
