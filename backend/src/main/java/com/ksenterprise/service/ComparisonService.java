package com.ksenterprise.service;

import com.ksenterprise.dto.request.ProductComparisonDTO;
import com.ksenterprise.dto.response.ComparisonMatrixDTO;

import java.util.List;

public interface ComparisonService {
    ComparisonMatrixDTO getComparisonMatrix(Long baseProductId);
    ComparisonMatrixDTO addCompetitorProduct(ProductComparisonDTO request);
    ComparisonMatrixDTO updateCompetitorProduct(Long comparisonId, ProductComparisonDTO request);
    void deleteCompetitorProduct(Long comparisonId);
    List<ComparisonMatrixDTO.CompetitorProductItemDTO> getAllCompetitorProducts();
}
