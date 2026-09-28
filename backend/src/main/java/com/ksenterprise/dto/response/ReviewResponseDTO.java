package com.ksenterprise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {

    private Long id;
    private Long productId;
    private String productName;
    private String customerName;
    private int rating;
    private String reviewText;
    private boolean approved;
    private LocalDateTime createdAt;
}
