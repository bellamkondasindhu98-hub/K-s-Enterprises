package com.ksenterprise.service.impl;

import com.ksenterprise.dto.response.CategoryResponseDTO;
import com.ksenterprise.dto.response.ProductResponseDTO;
import com.ksenterprise.dto.response.SearchResultDTO;
import com.ksenterprise.model.Product;
import com.ksenterprise.repository.CategoryRepository;
import com.ksenterprise.repository.ProductRepository;
import com.ksenterprise.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public SearchResultDTO search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return SearchResultDTO.builder()
                    .query("")
                    .totalResults(0)
                    .products(Collections.emptyList())
                    .categories(Collections.emptyList())
                    .build();
        }

        String trimmedQuery = query.trim();
        List<Product> matchedProducts = productRepository.searchProducts(trimmedQuery);

        List<ProductResponseDTO> productDTOs = matchedProducts.stream()
                .map(p -> ProductResponseDTO.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .slug(p.getSlug())
                        .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                        .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                        .price(p.getPrice())
                        .description(p.getDescription())
                        .suitableFish(p.getSuitableFish())
                        .feedType(p.getFeedType())
                        .packageSize(p.getPackageSize())
                        .availability(p.getAvailability())
                        .primaryImage(p.getPrimaryImage())
                        .featured(p.isFeatured())
                        .active(p.isActive())
                        .build())
                .collect(Collectors.toList());

        List<CategoryResponseDTO> matchedCategories = categoryRepository.findByActiveTrue().stream()
                .filter(c -> c.getName().toLowerCase().contains(trimmedQuery.toLowerCase()) ||
                             (c.getDescription() != null && c.getDescription().toLowerCase().contains(trimmedQuery.toLowerCase())))
                .map(c -> CategoryResponseDTO.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .slug(c.getSlug())
                        .description(c.getDescription())
                        .iconName(c.getIconName())
                        .productCount(c.getProducts() != null ? c.getProducts().size() : 0)
                        .build())
                .collect(Collectors.toList());

        return SearchResultDTO.builder()
                .query(trimmedQuery)
                .totalResults(productDTOs.size())
                .products(productDTOs)
                .categories(matchedCategories)
                .build();
    }
}
