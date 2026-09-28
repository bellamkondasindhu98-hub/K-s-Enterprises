package com.ksenterprise.dto.response;

import com.ksenterprise.model.Availability;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {

    private Long id;
    private String name;
    private String slug;
    private Long categoryId;
    private String categoryName;
    private BigDecimal price;
    private String description;
    private String suitableFish;
    private String feedType;
    private String packageSize;
    private Availability availability;
    private String primaryImage;
    private boolean featured;
    private boolean active;
}
