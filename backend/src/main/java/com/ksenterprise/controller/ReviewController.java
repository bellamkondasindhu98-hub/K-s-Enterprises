package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.request.ReviewRequestDTO;
import com.ksenterprise.dto.response.ReviewResponseDTO;
import com.ksenterprise.security.UserPrincipal;
import com.ksenterprise.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewResponseDTO> reviews = reviewService.getApprovedReviewsByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<ReviewResponseDTO>> submitReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReviewRequestDTO request) {
        Long userId = (currentUser != null) ? currentUser.getId() : null;
        ReviewResponseDTO response = reviewService.submitReview(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Thank you! Your review has been submitted for approval.", response));
    }
}
