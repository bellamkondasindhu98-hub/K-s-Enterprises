package com.ksenterprise.dto.response;

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
public class ComparisonMatrixDTO {

    private ProductResponseDTO ksProduct;
    private List<CompetitorProductItemDTO> competitors;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompetitorProductItemDTO {
        private Long id;
        private String competitorName;
        private BigDecimal price;
        private String proteinContent;
        private String packageSize;
        private String fishType;
        private String feedType;
        private String availability;
        private String nutritionalDetails;
        private String additionalFactors; // JSON string
    }
}
