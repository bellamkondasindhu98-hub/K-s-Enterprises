/**
 * K's Enterprises - Product Card Component Factory
 */
function createProductCardHtml(product, rootPath = './') {
  const isAvailable = product.availability === 'AVAILABLE';
  const inWishlist = wishlistService ? wishlistService.isProductInWishlist(product.id) : false;
  const imageSrc = product.primaryImage ? `${rootPath}${product.primaryImage.replace(/^\//, '')}` : `${rootPath}assets/images/product-floating-feed-28.svg`;

  return `
    <div class="card product-card" id="product-${product.id}">
      <div class="product-card-img-wrapper">
        <span class="badge ${isAvailable ? 'badge-in-stock' : 'badge-out-of-stock'} product-card-badge">
          ${isAvailable ? 'AVAILABLE' : 'OUT OF STOCK'}
        </span>

        <button 
          class="btn-icon product-card-wishlist ${inWishlist ? 'active' : ''}" 
          onclick="toggleProductWishlist(${product.id}, event)"
          title="Add to Wishlist"
          aria-label="Wishlist"
        >
          ${inWishlist ? '❤️' : '🤍'}
        </button>

        <a href="${rootPath}pages/product-details/index.html?id=${product.id}">
          <img src="${imageSrc}" alt="${product.name}" class="product-card-img" onerror="this.src='${rootPath}assets/images/product-floating-feed-28.svg'">
        </a>
      </div>

      <div class="card-body">
        <div class="product-card-category">${product.categoryName || 'Fish Feed'}</div>
        <h3 class="product-card-title">
          <a href="${rootPath}pages/product-details/index.html?id=${product.id}">${product.name}</a>
        </h3>
        <p class="product-card-desc">${product.description || ''}</p>

        <div class="product-card-specs">
          ${product.packageSize ? `<span class="spec-chip">📦 ${product.packageSize}</span>` : ''}
          ${product.feedType ? `<span class="spec-chip">💧 ${product.feedType}</span>` : ''}
          ${product.suitableFish ? `<span class="spec-chip">🐟 ${product.suitableFish.split(',')[0]}</span>` : ''}
        </div>

        <div class="product-card-price-row">
          <div class="product-card-price">₹${Number(product.price).toLocaleString('en-IN')}</div>
          <button class="btn-icon" onclick="openShareModal('${encodeURIComponent(product.name)}', '${rootPath}pages/product-details/index.html?id=${product.id}')" title="Share Product" aria-label="Share">
            🔗
          </button>
        </div>

        <div class="product-card-actions">
          ${isAvailable ? `
            <button 
              class="btn btn-whatsapp" 
              onclick="orderProductViaWhatsApp(${product.id})"
              title="Order on WhatsApp"
            >
              💬 WhatsApp Order
            </button>
          ` : `
            <button 
              class="btn btn-whatsapp disabled" 
              disabled 
              title="Product is currently out of stock"
            >
              🚫 Out of Stock
            </button>
          `}

          <a href="${rootPath}pages/product-details/index.html?id=${product.id}" class="btn btn-outline" style="padding: 0.65rem 0.85rem;" title="View Full Details">
            👁️
          </a>
        </div>
      </div>
    </div>
  `;
}

// Global helpers attached to window for card actions
window.toggleProductWishlist = async function(productId, event) {
  if (event) event.stopPropagation();
  const inWishlist = wishlistService.isProductInWishlist(productId);
  if (inWishlist) {
    await wishlistService.removeFromWishlist(productId);
    alert('Removed from wishlist');
  } else {
    // Look up card for data or fetch
    await wishlistService.addToWishlist(productId, { id: productId });
    alert('Added to wishlist!');
  }
  // Refresh wishlist buttons
  document.querySelectorAll(`#product-${productId} .product-card-wishlist`).forEach(btn => {
    btn.classList.toggle('active', !inWishlist);
    btn.innerHTML = !inWishlist ? '❤️' : '🤍';
  });
};

window.orderProductViaWhatsApp = async function(productId) {
  try {
    const res = await productService.getProductById(productId);
    if (res.success && res.data) {
      whatsappService.openOrderChat(res.data);
    }
  } catch (e) {
    console.error('Error initiating WhatsApp order:', e);
  }
};

window.openShareModal = function(productName, relativeUrl) {
  const fullUrl = window.location.origin + relativeUrl;
  if (navigator.share) {
    navigator.share({
      title: decodeURIComponent(productName),
      text: `Check out ${decodeURIComponent(productName)} from K's Enterprises:`,
      url: fullUrl
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert(`Product link copied to clipboard:\n${fullUrl}`);
    });
  }
};
