package com.ksenterprise.service.impl;

import com.ksenterprise.dto.request.ProductComparisonDTO;
import com.ksenterprise.dto.response.ComparisonMatrixDTO;
import com.ksenterprise.dto.response.ProductResponseDTO;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.Product;
import com.ksenterprise.model.ProductComparison;
import com.ksenterprise.repository.ProductComparisonRepository;
import com.ksenterprise.repository.ProductRepository;
import com.ksenterprise.service.ComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComparisonServiceImpl implements ComparisonService {

    private final ProductComparisonRepository comparisonRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public ComparisonMatrixDTO getComparisonMatrix(Long baseProductId) {
        Product baseProduct = productRepository.findById(baseProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", baseProductId));

        List<ComparisonMatrixDTO.CompetitorProductItemDTO> competitors = comparisonRepository
                .findByBaseProductId(baseProductId).stream()
                .map(this::mapToCompetitorItem)
                .collect(Collectors.toList());

        ProductResponseDTO ksProductDTO = ProductResponseDTO.builder()
                .id(baseProduct.getId())
                .name(baseProduct.getName())
                .slug(baseProduct.getSlug())
                .categoryId(baseProduct.getCategory() != null ? baseProduct.getCategory().getId() : null)
                .categoryName(baseProduct.getCategory() != null ? baseProduct.getCategory().getName() : null)
                .price(baseProduct.getPrice())
                .description(baseProduct.getDescription())
                .suitableFish(baseProduct.getSuitableFish())
                .feedType(baseProduct.getFeedType())
                .packageSize(baseProduct.getPackageSize())
                .availability(baseProduct.getAvailability())
                .primaryImage(baseProduct.getPrimaryImage())
                .featured(baseProduct.isFeatured())
                .active(baseProduct.isActive())
                .build();

        return ComparisonMatrixDTO.builder()
                .ksProduct(ksProductDTO)
                .competitors(competitors)
                .build();
    }

    @Override
    @Transactional
    public ComparisonMatrixDTO addCompetitorProduct(ProductComparisonDTO request) {
        Product baseProduct = productRepository.findById(request.getBaseProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getBaseProductId()));

        ProductComparison comparison = ProductComparison.builder()
                .baseProduct(baseProduct)
                .competitorName(request.getCompetitorName())
                .price(request.getPrice())
                .proteinContent(request.getProteinContent())
                .packageSize(request.getPackageSize())
                .fishType(request.getFishType())
                .feedType(request.getFeedType())
                .availability(request.getAvailability() != null ? request.getAvailability() : "Available")
                .nutritionalDetails(request.getNutritionalDetails())
                .additionalFactors(request.getAdditionalFactors())
                .build();

        comparisonRepository.save(comparison);
        return getComparisonMatrix(baseProduct.getId());
    }

    @Override
    @Transactional
    public ComparisonMatrixDTO updateCompetitorProduct(Long comparisonId, ProductComparisonDTO request) {
        ProductComparison comp = comparisonRepository.findById(comparisonId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductComparison", "id", comparisonId));

        if (request.getBaseProductId() != null && !request.getBaseProductId().equals(comp.getBaseProduct().getId())) {
            Product newBase = productRepository.findById(request.getBaseProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getBaseProductId()));
            comp.setBaseProduct(newBase);
        }

        comp.setCompetitorName(request.getCompetitorName());
        comp.setPrice(request.getPrice());
        comp.setProteinContent(request.getProteinContent());
        comp.setPackageSize(request.getPackageSize());
        comp.setFishType(request.getFishType());
        comp.setFeedType(request.getFeedType());
        if (request.getAvailability() != null) {
            comp.setAvailability(request.getAvailability());
        }
        comp.setNutritionalDetails(request.getNutritionalDetails());
        comp.setAdditionalFactors(request.getAdditionalFactors());

        ProductComparison saved = comparisonRepository.save(comp);
        return getComparisonMatrix(saved.getBaseProduct().getId());
    }

    @Override
    @Transactional
    public void deleteCompetitorProduct(Long comparisonId) {
        ProductComparison comp = comparisonRepository.findById(comparisonId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductComparison", "id", comparisonId));
        comparisonRepository.delete(comp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComparisonMatrixDTO.CompetitorProductItemDTO> getAllCompetitorProducts() {
        return comparisonRepository.findAll().stream()
                .map(this::mapToCompetitorItem)
                .collect(Collectors.toList());
    }

    private ComparisonMatrixDTO.CompetitorProductItemDTO mapToCompetitorItem(ProductComparison c) {
        return ComparisonMatrixDTO.CompetitorProductItemDTO.builder()
                .id(c.getId())
                .competitorName(c.getCompetitorName())
                .price(c.getPrice())
                .proteinContent(c.getProteinContent())
                .packageSize(c.getPackageSize())
                .fishType(c.getFishType())
                .feedType(c.getFeedType())
                .availability(c.getAvailability())
                .nutritionalDetails(c.getNutritionalDetails())
                .additionalFactors(c.getAdditionalFactors())
                .build();
    }
}
