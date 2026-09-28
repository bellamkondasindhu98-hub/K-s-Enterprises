package com.ksenterprise.service.impl;

import com.ksenterprise.dto.request.ReviewRequestDTO;
import com.ksenterprise.dto.response.ReviewResponseDTO;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.Product;
import com.ksenterprise.model.Review;
import com.ksenterprise.model.User;
import com.ksenterprise.repository.ProductRepository;
import com.ksenterprise.repository.ReviewRepository;
import com.ksenterprise.repository.UserRepository;
import com.ksenterprise.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getApprovedReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewResponseDTO submitReview(Long userId, ReviewRequestDTO request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .customerName(request.getCustomerName())
                .rating(request.getRating())
                .reviewText(request.getReviewText())
                .approved(false) // Requires admin moderation
                .build();

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getPendingReviews() {
        return reviewRepository.findByApprovedFalseOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewResponseDTO moderateReview(Long reviewId, boolean approved) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        review.setApproved(approved);
        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        reviewRepository.delete(review);
    }

    private ReviewResponseDTO mapToResponse(Review r) {
        return ReviewResponseDTO.builder()
                .id(r.getId())
                .productId(r.getProduct().getId())
                .productName(r.getProduct().getName())
                .customerName(r.getCustomerName())
                .rating(r.getRating())
                .reviewText(r.getReviewText())
                .approved(r.isApproved())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
