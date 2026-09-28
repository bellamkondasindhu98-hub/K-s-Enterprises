/**
 * Wishlist Page Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  await loadWishlistItems();
});

async function loadWishlistItems() {
  const container = document.getElementById('wishlist-container');
  try {
    const res = await wishlistService.getWishlist();
    if (res.success && res.data && res.data.length > 0) {
      renderWishlist(res.data);
    } else {
      renderEmptyWishlist();
    }
  } catch (e) {
    renderEmptyWishlist();
  }
}

function renderWishlist(items) {
  const container = document.getElementById('wishlist-container');
  const countEl = document.getElementById('wishlist-count');
  if (countEl) countEl.textContent = `(${items.length} saved)`;

  let html = `
    <table class="wishlist-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Availability</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  items.forEach(item => {
    const isAvail = item.availability === 'AVAILABLE';
    const imgSrc = item.primaryImage ? `../../${item.primaryImage.replace(/^\//, '')}` : '../../assets/images/product-floating-feed-28.svg';

    html += `
      <tr id="wishlist-row-${item.productId}">
        <td>
          <div class="flex items-center gap-2">
            <img src="${imgSrc}" class="wishlist-item-img" alt="${item.productName}">
            <div>
              <a href="../product-details/index.html?id=${item.productId}" style="font-weight: 700; color: var(--text-primary);">
                ${item.productName}
              </a>
            </div>
          </div>
        </td>
        <td>${item.categoryName || 'Fish Feed'}</td>
        <td style="font-weight: 700;">₹${item.price}</td>
        <td>
          <span class="badge ${isAvail ? 'badge-in-stock' : 'badge-out-of-stock'}">
            ${isAvail ? 'AVAILABLE' : 'OUT OF STOCK'}
          </span>
        </td>
        <td>
          <div class="flex items-center gap-1">
            ${isAvail ? `
              <button class="btn btn-whatsapp" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="orderProductViaWhatsApp(${item.productId})">
                💬 WhatsApp Order
              </button>
            ` : ''}
            <a href="../product-details/index.html?id=${item.productId}" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
              View Details
            </a>
            <button class="btn btn-outline" style="padding: 0.4rem 0.6rem; color: var(--danger-color);" onclick="removeWishlistItem(${item.productId})" title="Remove">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderEmptyWishlist() {
  const container = document.getElementById('wishlist-container');
  const countEl = document.getElementById('wishlist-count');
  if (countEl) countEl.textContent = '(0)';

  container.innerHTML = `
    <div style="text-align: center; padding: 4rem 2rem; background-color: var(--card-bg); border-radius: var(--border-radius-lg); border: 1px dashed var(--border-color);">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🤍</div>
      <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Your Wishlist is Empty</h3>
      <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 1.5rem;">Explore our high-protein fish feed formulations and save items you are interested in.</p>
      <a href="../products/index.html" class="btn btn-primary">Browse Feed Products</a>
    </div>
  `;
}

window.removeWishlistItem = async function(productId) {
  await wishlistService.removeFromWishlist(productId);
  const row = document.getElementById(`wishlist-row-${productId}`);
  if (row) row.remove();
  const res = await wishlistService.getWishlist();
  if (!res.data || res.data.length === 0) {
    renderEmptyWishlist();
  }
};
