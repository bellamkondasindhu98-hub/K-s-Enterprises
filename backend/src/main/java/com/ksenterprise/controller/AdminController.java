package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.request.*;
import com.ksenterprise.dto.response.*;
import com.ksenterprise.model.Availability;
import com.ksenterprise.model.Feedback;
import com.ksenterprise.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final ReviewService reviewService;
    private final ComparisonService comparisonService;
    private final RecommendationService recommendationService;
    private final CompanyService companyService;
    private final UserService userService;
    private final FeedbackService feedbackService;

    // -------------------------------------------------------------------------
    // 1. Dashboard Overview
    // -------------------------------------------------------------------------
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // -------------------------------------------------------------------------
    // 2. Product Management
    // -------------------------------------------------------------------------
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(@Valid @RequestBody ProductRequestDTO request) {
        ProductResponseDTO product = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO request) {
        ProductResponseDTO product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateStockStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Availability availability = Availability.valueOf(body.get("availability"));
        ProductResponseDTO product = productService.updateStockStatus(id, availability);
        return ResponseEntity.ok(ApiResponse.success("Stock status updated to " + availability, product));
    }

    // -------------------------------------------------------------------------
    // 3. Review Moderation
    // -------------------------------------------------------------------------
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getAllReviews() {
        List<ReviewResponseDTO> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/reviews/pending")
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getPendingReviews() {
        List<ReviewResponseDTO> reviews = reviewService.getPendingReviews();
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PatchMapping("/reviews/{id}/moderate")
    public ResponseEntity<ApiResponse<ReviewResponseDTO>> moderateReview(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean approved = body.getOrDefault("approved", true);
        ReviewResponseDTO review = reviewService.moderateReview(id, approved);
        return ResponseEntity.ok(ApiResponse.success("Review moderation updated", review));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }

    // -------------------------------------------------------------------------
    // 4. Comparison Management
    // -------------------------------------------------------------------------
    @GetMapping("/comparisons")
    public ResponseEntity<ApiResponse<List<ComparisonMatrixDTO.CompetitorProductItemDTO>>> getAllComparisons() {
        List<ComparisonMatrixDTO.CompetitorProductItemDTO> list = comparisonService.getAllCompetitorProducts();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/comparisons")
    public ResponseEntity<ApiResponse<ComparisonMatrixDTO>> addCompetitorProduct(
            @Valid @RequestBody ProductComparisonDTO request) {
        ComparisonMatrixDTO matrix = comparisonService.addCompetitorProduct(request);
        return ResponseEntity.ok(ApiResponse.success("Competitor product added", matrix));
    }

    @PutMapping("/comparisons/{id}")
    public ResponseEntity<ApiResponse<ComparisonMatrixDTO>> updateCompetitorProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductComparisonDTO request) {
        ComparisonMatrixDTO matrix = comparisonService.updateCompetitorProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Competitor product updated", matrix));
    }

    @DeleteMapping("/comparisons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCompetitorProduct(@PathVariable Long id) {
        comparisonService.deleteCompetitorProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Competitor product removed", null));
    }

    // -------------------------------------------------------------------------
    // 5. Recommendations Management
    // -------------------------------------------------------------------------
    @PostMapping("/recommendations")
    public ResponseEntity<ApiResponse<Void>> addRecommendation(@RequestBody Map<String, Object> body) {
        Long sourceId = Long.valueOf(body.get("sourceProductId").toString());
        Long recommendedId = Long.valueOf(body.get("recommendedProductId").toString());
        int order = body.get("displayOrder") != null ? Integer.parseInt(body.get("displayOrder").toString()) : 0;
        recommendationService.addRecommendation(sourceId, recommendedId, order);
        return ResponseEntity.ok(ApiResponse.success("Recommendation added successfully", null));
    }

    @DeleteMapping("/recommendations")
    public ResponseEntity<ApiResponse<Void>> removeRecommendation(
            @RequestParam Long sourceProductId,
            @RequestParam Long recommendedProductId) {
        recommendationService.removeRecommendation(sourceProductId, recommendedProductId);
        return ResponseEntity.ok(ApiResponse.success("Recommendation removed successfully", null));
    }

    // -------------------------------------------------------------------------
    // 6. Company & CEO Profile Management
    // -------------------------------------------------------------------------
    @PutMapping("/company")
    public ResponseEntity<ApiResponse<CompanyProfileResponseDTO>> updateCompany(
            @Valid @RequestBody CompanyUpdateDTO dto) {
        CompanyProfileResponseDTO company = companyService.updateCompany(dto);
        return ResponseEntity.ok(ApiResponse.success("Company information updated", company));
    }

    @PutMapping("/ceo")
    public ResponseEntity<ApiResponse<CeoResponseDTO>> updateCeo(
            @Valid @RequestBody CeoUpdateDTO dto) {
        CeoResponseDTO ceo = companyService.updateCeo(dto);
        return ResponseEntity.ok(ApiResponse.success("CEO information updated", ceo));
    }

    // -------------------------------------------------------------------------
    // 7. Website CMS Content Management
    // -------------------------------------------------------------------------
    @PutMapping("/website/content")
    public ResponseEntity<ApiResponse<String>> updateWebsiteContent(
            @Valid @RequestBody WebsiteContentDTO dto) {
        String result = companyService.updateWebsiteContent(dto.getSectionKey(), dto.getContentJson());
        return ResponseEntity.ok(ApiResponse.success("Section content updated", result));
    }

    // -------------------------------------------------------------------------
    // 8. Customer Management
    // -------------------------------------------------------------------------
    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getCustomers() {
        List<UserProfileResponse> customers = userService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    // -------------------------------------------------------------------------
    // 9. Feedback Management
    // -------------------------------------------------------------------------
    @GetMapping("/feedback")
    public ResponseEntity<ApiResponse<List<Feedback>>> getAllFeedback() {
        List<Feedback> list = feedbackService.getAllFeedback();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PatchMapping("/feedback/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markFeedbackAsRead(@PathVariable Long id) {
        feedbackService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @DeleteMapping("/feedback/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted", null));
    }
}
