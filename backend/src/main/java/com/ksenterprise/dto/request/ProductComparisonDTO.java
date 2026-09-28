package com.ksenterprise.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductComparisonDTO {

    @NotNull(message = "Base product ID is required")
    private Long baseProductId;

    @NotBlank(message = "Competitor name is required")
    private String competitorName;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotBlank(message = "Protein content is required")
    private String proteinContent;

    @NotBlank(message = "Package size is required")
    private String packageSize;

    @NotBlank(message = "Fish type is required")
    private String fishType;

    @NotBlank(message = "Feed type is required")
    private String feedType;

    private String availability = "Available";
    private String nutritionalDetails;
    private String additionalFactors; // JSON string
}
