/**
 * K's Enterprises - Comparison Service
 */
class ComparisonService {
  async getComparisonMatrix(baseProductId) {
    return await apiService.get(`/comparison/${baseProductId}`);
  }
}

const comparisonService = new ComparisonService();
if (typeof window !== 'undefined') {
  window.comparisonService = comparisonService;
}
