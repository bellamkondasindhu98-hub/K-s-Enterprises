/**
 * K's Enterprises - Recommendation Service
 */
class RecommendationService {
  async getRecommendations(sourceProductId) {
    return await apiService.get(`/recommendations/${sourceProductId}`);
  }
}

const recommendationService = new RecommendationService();
if (typeof window !== 'undefined') {
  window.recommendationService = recommendationService;
}
