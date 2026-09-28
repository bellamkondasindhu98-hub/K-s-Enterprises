package com.ksenterprise.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_comparisons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_product_id", nullable = false)
    private Product baseProduct;

    @Column(name = "competitor_name", nullable = false, length = 100)
    private String competitorName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "protein_content", nullable = false, length = 50)
    private String proteinContent;

    @Column(name = "package_size", nullable = false, length = 50)
    private String packageSize;

    @Column(name = "fish_type", nullable = false, length = 150)
    private String fishType;

    @Column(name = "feed_type", nullable = false, length = 100)
    private String feedType;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String availability = "Available";

    @Column(name = "nutritional_details", columnDefinition = "TEXT")
    private String nutritionalDetails;

    @Column(name = "additional_factors", columnDefinition = "JSON")
    private String additionalFactors;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
