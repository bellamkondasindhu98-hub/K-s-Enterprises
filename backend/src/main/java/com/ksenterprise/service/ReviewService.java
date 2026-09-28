package com.ksenterprise.service;

import com.ksenterprise.dto.request.ReviewRequestDTO;
import com.ksenterprise.dto.response.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {
    List<ReviewResponseDTO> getApprovedReviewsByProductId(Long productId);
    ReviewResponseDTO submitReview(Long userId, ReviewRequestDTO request);
    List<ReviewResponseDTO> getAllReviews();
    List<ReviewResponseDTO> getPendingReviews();
    ReviewResponseDTO moderateReview(Long reviewId, boolean approved);
    void deleteReview(Long reviewId);
}
