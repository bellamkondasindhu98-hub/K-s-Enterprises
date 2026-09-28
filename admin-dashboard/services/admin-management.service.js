/**
 * Admin Unified Management Operations Service
 */
class AdminManagementService {
  // Stats
  async getDashboardStats() {
    return await adminApiService.get('/admin/dashboard/stats');
  }

  // Products
  async getProducts() {
    return await adminApiService.get('/products');
  }

  async createProduct(productData) {
    return await adminApiService.post('/admin/products', productData);
  }

  async updateProduct(id, productData) {
    return await adminApiService.put(`/admin/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return await adminApiService.delete(`/admin/products/${id}`);
  }

  async updateStockStatus(id, availability) {
    return await adminApiService.patch(`/admin/products/${id}/stock`, { availability });
  }

  // Reviews
  async getAllReviews() {
    return await adminApiService.get('/admin/reviews');
  }

  async moderateReview(id, approved) {
    return await adminApiService.patch(`/admin/reviews/${id}/moderate`, { approved });
  }

  async deleteReview(id) {
    return await adminApiService.delete(`/admin/reviews/${id}`);
  }

  // Competitor Comparison
  async getAllComparisons() {
    return await adminApiService.get('/admin/comparisons');
  }

  async addComparison(comparisonData) {
    return await adminApiService.post('/admin/comparisons', comparisonData);
  }

  async updateComparison(id, comparisonData) {
    return await adminApiService.put(`/admin/comparisons/${id}`, comparisonData);
  }

  async deleteComparison(id) {
    return await adminApiService.delete(`/admin/comparisons/${id}`);
  }

  // Recommendations
  async addRecommendation(sourceProductId, recommendedProductId, displayOrder = 0) {
    return await adminApiService.post('/admin/recommendations', {
      sourceProductId,
      recommendedProductId,
      displayOrder
    });
  }

  async removeRecommendation(sourceProductId, recommendedProductId) {
    return await adminApiService.delete(`/admin/recommendations?sourceProductId=${sourceProductId}&recommendedProductId=${recommendedProductId}`);
  }

  // Company Profile & CEO
  async updateCompany(companyData) {
    return await adminApiService.put('/admin/company', companyData);
  }

  async updateCeo(ceoData) {
    return await adminApiService.put('/admin/ceo', ceoData);
  }

  // Website CMS Content
  async updateWebsiteContent(sectionKey, contentJson) {
    return await adminApiService.put('/admin/website/content', {
      sectionKey,
      contentJson
    });
  }

  // Customers
  async getCustomers() {
    return await adminApiService.get('/admin/customers');
  }

  // Feedback
  async getAllFeedback() {
    return await adminApiService.get('/admin/feedback');
  }

  async markFeedbackRead(id) {
    return await adminApiService.patch(`/admin/feedback/${id}/read`, {});
  }

  async deleteFeedback(id) {
    return await adminApiService.delete(`/admin/feedback/${id}`);
  }
}

const adminManagementService = new AdminManagementService();
if (typeof window !== 'undefined') {
  window.adminManagementService = adminManagementService;
}
