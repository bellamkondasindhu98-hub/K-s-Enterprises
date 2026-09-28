package com.ksenterprise.dto.request;

import com.ksenterprise.model.Availability;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequestDTO {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private String description;
    private String specifications;
    private String suitableFish;
    private String feedType;
    private String packageSize;
    private String nutritionalInfo; // JSON string

    private Availability availability = Availability.AVAILABLE;

    private String primaryImage;
    private List<String> additionalImages;
    private boolean featured = false;
    private boolean active = true;
}
