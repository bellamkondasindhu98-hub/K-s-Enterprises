/**
 * K's Enterprises - Wishlist Service
 */
class WishlistService {
  constructor() {
    this.localKey = 'ks_local_wishlist';
  }

  async getWishlist() {
    if (authService.isAuthenticated()) {
      try {
        return await apiService.get('/wishlist');
      } catch (err) {
        console.warn('Wishlist API error, falling back to local:', err);
      }
    }
    const local = JSON.parse(localStorage.getItem(this.localKey) || '[]');
    return { success: true, data: local };
  }

  async addToWishlist(productId, productData = null) {
    if (authService.isAuthenticated()) {
      try {
        await apiService.post(`/wishlist/add/${productId}`, {});
      } catch (err) {
        console.warn('Backend wishlist sync failed, saving locally:', err);
      }
    }

    const local = JSON.parse(localStorage.getItem(this.localKey) || '[]');
    if (!local.find(item => item.productId === productId)) {
      local.push({
        productId,
        productName: productData?.name || 'Fish Feed Product',
        productSlug: productData?.slug || '',
        price: productData?.price || '',
        primaryImage: productData?.primaryImage || '/assets/images/product-floating-feed-28.svg',
        categoryName: productData?.categoryName || '',
        availability: productData?.availability || 'AVAILABLE',
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(this.localKey, JSON.stringify(local));
    }
    return { success: true };
  }

  async removeFromWishlist(productId) {
    if (authService.isAuthenticated()) {
      try {
        await apiService.delete(`/wishlist/remove/${productId}`);
      } catch (err) {
        console.warn('Backend wishlist removal failed:', err);
      }
    }

    let local = JSON.parse(localStorage.getItem(this.localKey) || '[]');
    local = local.filter(item => item.productId !== productId);
    localStorage.setItem(this.localKey, JSON.stringify(local));
    return { success: true };
  }

  isProductInWishlist(productId) {
    const local = JSON.parse(localStorage.getItem(this.localKey) || '[]');
    return local.some(item => item.productId === productId);
  }
}

const wishlistService = new WishlistService();
if (typeof window !== 'undefined') {
  window.wishlistService = wishlistService;
}
