package com.ksenterprise.service.impl;

import com.ksenterprise.dto.response.ProductResponseDTO;
import com.ksenterprise.exception.BadRequestException;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.Product;
import com.ksenterprise.model.ProductRecommendation;
import com.ksenterprise.repository.ProductRecommendationRepository;
import com.ksenterprise.repository.ProductRepository;
import com.ksenterprise.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final ProductRecommendationRepository recommendationRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getRecommendations(Long sourceProductId) {
        return recommendationRepository.findBySourceProductIdOrderByDisplayOrderAsc(sourceProductId).stream()
                .map(r -> mapToResponse(r.getRecommendedProduct()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addRecommendation(Long sourceProductId, Long recommendedProductId, int order) {
        if (sourceProductId.equals(recommendedProductId)) {
            throw new BadRequestException("A product cannot be recommended to itself");
        }

        Product source = productRepository.findById(sourceProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Source Product", "id", sourceProductId));
        Product target = productRepository.findById(recommendedProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Recommended Product", "id", recommendedProductId));

        ProductRecommendation recommendation = recommendationRepository
                .findBySourceProductIdAndRecommendedProductId(sourceProductId, recommendedProductId)
                .orElseGet(() -> ProductRecommendation.builder()
                        .sourceProduct(source)
                        .recommendedProduct(target)
                        .build());

        recommendation.setDisplayOrder(order);
        recommendationRepository.save(recommendation);
    }

    @Override
    @Transactional
    public void removeRecommendation(Long sourceProductId, Long recommendedProductId) {
        recommendationRepository.deleteBySourceProductIdAndRecommendedProductId(sourceProductId, recommendedProductId);
    }

    private ProductResponseDTO mapToResponse(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .price(product.getPrice())
                .description(product.getDescription())
                .suitableFish(product.getSuitableFish())
                .feedType(product.getFeedType())
                .packageSize(product.getPackageSize())
                .availability(product.getAvailability())
                .primaryImage(product.getPrimaryImage())
                .featured(product.isFeatured())
                .active(product.isActive())
                .build();
    }
}
