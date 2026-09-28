/**
 * K's Enterprises - Review & Feedback Service
 */
class ReviewService {
  async getReviewsByProduct(productId) {
    return await apiService.get(`/reviews/product/${productId}`);
  }

  async submitReview(productId, customerName, rating, reviewText) {
    return await apiService.post('/reviews/submit', {
      productId,
      customerName,
      rating: parseInt(rating, 10),
      reviewText
    });
  }

  async submitGeneralFeedback(name, email, phone, message) {
    return await apiService.post('/feedback', {
      name,
      email,
      phone,
      message
    });
  }
}

const reviewService = new ReviewService();
if (typeof window !== 'undefined') {
  window.reviewService = reviewService;
}
