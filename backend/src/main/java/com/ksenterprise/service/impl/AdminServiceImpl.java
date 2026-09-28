package com.ksenterprise.service.impl;

import com.ksenterprise.model.Availability;
import com.ksenterprise.repository.FeedbackRepository;
import com.ksenterprise.repository.ProductRepository;
import com.ksenterprise.repository.ReviewRepository;
import com.ksenterprise.repository.UserRepository;
import com.ksenterprise.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final FeedbackRepository feedbackRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalProducts = productRepository.count();
        long inStockProducts = productRepository.findByAvailabilityAndActiveTrue(Availability.AVAILABLE).size();
        long outOfStockProducts = productRepository.findByAvailabilityAndActiveTrue(Availability.OUT_OF_STOCK).size();
        long totalCustomers = userRepository.count();
        long pendingReviews = reviewRepository.findByApprovedFalseOrderByCreatedAtDesc().size();
        long totalReviews = reviewRepository.count();
        long unreadFeedback = feedbackRepository.findByReadFalseOrderByCreatedAtDesc().size();
        long totalFeedback = feedbackRepository.count();

        stats.put("totalProducts", totalProducts);
        stats.put("inStockProducts", inStockProducts);
        stats.put("outOfStockProducts", outOfStockProducts);
        stats.put("totalCustomers", totalCustomers);
        stats.put("pendingReviews", pendingReviews);
        stats.put("totalReviews", totalReviews);
        stats.put("unreadFeedback", unreadFeedback);
        stats.put("totalFeedback", totalFeedback);

        return stats;
    }
}
