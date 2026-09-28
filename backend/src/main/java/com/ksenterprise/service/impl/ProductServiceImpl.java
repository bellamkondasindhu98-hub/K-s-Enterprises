package com.ksenterprise.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksenterprise.dto.request.ProductRequestDTO;
import com.ksenterprise.dto.response.CategoryResponseDTO;
import com.ksenterprise.dto.response.ProductDetailResponseDTO;
import com.ksenterprise.dto.response.ProductResponseDTO;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.Availability;
import com.ksenterprise.model.Category;
import com.ksenterprise.model.Product;
import com.ksenterprise.repository.*;
import com.ksenterprise.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final ProductRecommendationRepository recommendationRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToDetailResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponseDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        return mapToDetailResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findByActiveTrue().stream()
                .map(cat -> CategoryResponseDTO.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .slug(cat.getSlug())
                        .description(cat.getDescription())
                        .iconName(cat.getIconName())
                        .productCount(cat.getProducts() != null ? cat.getProducts().size() : 0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        String slug = toSlug(request.getName());
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = toSlug(request.getName()) + "-" + counter++;
        }

        String additionalImagesJson = null;
        if (request.getAdditionalImages() != null && !request.getAdditionalImages().isEmpty()) {
            try {
                additionalImagesJson = objectMapper.writeValueAsString(request.getAdditionalImages());
            } catch (Exception e) {
                log.warn("Failed to serialize additional images: {}", e.getMessage());
            }
        }

        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .slug(slug)
                .price(request.getPrice())
                .description(request.getDescription())
                .specifications(request.getSpecifications())
                .suitableFish(request.getSuitableFish())
                .feedType(request.getFeedType())
                .packageSize(request.getPackageSize())
                .nutritionalInfo(request.getNutritionalInfo())
                .availability(request.getAvailability() != null ? request.getAvailability() : Availability.AVAILABLE)
                .primaryImage(request.getPrimaryImage())
                .additionalImages(additionalImagesJson)
                .featured(request.isFeatured())
                .active(request.isActive())
                .build();

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        product.setCategory(category);
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setSpecifications(request.getSpecifications());
        product.setSuitableFish(request.getSuitableFish());
        product.setFeedType(request.getFeedType());
        product.setPackageSize(request.getPackageSize());
        product.setNutritionalInfo(request.getNutritionalInfo());
        if (request.getAvailability() != null) {
            product.setAvailability(request.getAvailability());
        }
        product.setPrimaryImage(request.getPrimaryImage());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());

        if (request.getAdditionalImages() != null) {
            try {
                product.setAdditionalImages(objectMapper.writeValueAsString(request.getAdditionalImages()));
            } catch (Exception e) {
                log.warn("Failed to serialize additional images: {}", e.getMessage());
            }
        }

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateStockStatus(Long id, Availability availability) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setAvailability(availability);
        Product saved = productRepository.save(product);
        return mapToResponse(saved);
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

    private ProductDetailResponseDTO mapToDetailResponse(Product product) {
        Double avgRating = reviewRepository.findAverageRatingByProductId(product.getId());
        Long countReviews = reviewRepository.countApprovedReviewsByProductId(product.getId());

        List<String> additionalImgs = new ArrayList<>();
        if (product.getAdditionalImages() != null && !product.getAdditionalImages().isEmpty()) {
            try {
                additionalImgs = objectMapper.readValue(product.getAdditionalImages(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                log.debug("No JSON array for additional images");
            }
        }

        List<ProductResponseDTO> recommended = recommendationRepository
                .findBySourceProductIdOrderByDisplayOrderAsc(product.getId()).stream()
                .map(r -> mapToResponse(r.getRecommendedProduct()))
                .collect(Collectors.toList());

        return ProductDetailResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .price(product.getPrice())
                .description(product.getDescription())
                .specifications(product.getSpecifications())
                .suitableFish(product.getSuitableFish())
                .feedType(product.getFeedType())
                .packageSize(product.getPackageSize())
                .nutritionalInfo(product.getNutritionalInfo())
                .availability(product.getAvailability())
                .primaryImage(product.getPrimaryImage())
                .additionalImages(additionalImgs)
                .featured(product.isFeatured())
                .active(product.isActive())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .reviewCount(countReviews != null ? countReviews.intValue() : 0)
                .recommendedProducts(recommended)
                .build();
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
