package com.ksenterprise.service;

import com.ksenterprise.dto.response.ProductResponseDTO;

import java.util.List;

public interface RecommendationService {
    List<ProductResponseDTO> getRecommendations(Long sourceProductId);
    void addRecommendation(Long sourceProductId, Long recommendedProductId, int order);
    void removeRecommendation(Long sourceProductId, Long recommendedProductId);
}
