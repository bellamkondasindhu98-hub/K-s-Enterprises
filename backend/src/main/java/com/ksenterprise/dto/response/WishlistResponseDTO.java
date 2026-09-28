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
public class WishlistResponseDTO {

    private Long wishlistId;
    private Long productId;
    private String productName;
    private String productSlug;
    private String price;
    private String primaryImage;
    private String categoryName;
    private String availability;
    private LocalDateTime addedAt;
}
