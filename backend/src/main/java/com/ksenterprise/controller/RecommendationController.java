package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.response.ProductResponseDTO;
import com.ksenterprise.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{sourceProductId}")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getRecommendations(@PathVariable Long sourceProductId) {
        List<ProductResponseDTO> recommendations = recommendationService.getRecommendations(sourceProductId);
        return ResponseEntity.ok(ApiResponse.success(recommendations));
    }
}
