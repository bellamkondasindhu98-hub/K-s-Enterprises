/**
 * K's Enterprises - Wishlist Button Component
 */
function renderWishlistButton(containerId, product) {
  const container = document.getElementById(containerId);
  if (!container || !product) return;

  const inWishlist = wishlistService.isProductInWishlist(product.id);

  container.innerHTML = `
    <button 
      class="btn-wishlist ${inWishlist ? 'active' : ''}" 
      onclick="handleWishlistClick(${product.id}, event)"
      id="btn-wishlist-${product.id}"
    >
      <span>${inWishlist ? '❤️' : '🤍'}</span>
      <span>${inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
    </button>
  `;
}

async function handleWishlistClick(productId, event) {
  if (event) event.preventDefault();
  const inWishlist = wishlistService.isProductInWishlist(productId);
  if (inWishlist) {
    await wishlistService.removeFromWishlist(productId);
  } else {
    await wishlistService.addToWishlist(productId);
  }
  const btn = document.getElementById(`btn-wishlist-${productId}`);
  if (btn) {
    btn.classList.toggle('active', !inWishlist);
    btn.innerHTML = `<span>${!inWishlist ? '❤️' : '🤍'}</span> <span>${!inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>`;
  }
}
