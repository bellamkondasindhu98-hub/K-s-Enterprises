package com.ksenterprise.dto.response;

import com.ksenterprise.model.Availability;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponseDTO {

    private Long id;
    private String name;
    private String slug;
    private Long categoryId;
    private String categoryName;
    private BigDecimal price;
    private String description;
    private String specifications;
    private String suitableFish;
    private String feedType;
    private String packageSize;
    private String nutritionalInfo; // JSON string
    private Availability availability;
    private String primaryImage;
    private List<String> additionalImages;
    private boolean featured;
    private boolean active;
    private double averageRating;
    private int reviewCount;
    private List<ProductResponseDTO> recommendedProducts;
}
