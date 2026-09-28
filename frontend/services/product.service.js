/**
 * K's Enterprises - Product Service
 */
class ProductService {
  async getAllProducts(categoryId = null) {
    const endpoint = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    return await apiService.get(endpoint);
  }

  async getFeaturedProducts() {
    return await apiService.get('/products/featured');
  }

  async getCategories() {
    return await apiService.get('/products/categories');
  }

  async getProductById(id) {
    return await apiService.get(`/products/${id}`);
  }

  async getProductBySlug(slug) {
    return await apiService.get(`/products/slug/${slug}`);
  }

  async searchProducts(query) {
    return await apiService.get(`/search?q=${encodeURIComponent(query)}`);
  }
}

const productService = new ProductService();
if (typeof window !== 'undefined') {
  window.productService = productService;
}
