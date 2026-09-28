package com.ksenterprise.repository;

import com.ksenterprise.model.ProductRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRecommendationRepository extends JpaRepository<ProductRecommendation, Long> {
    List<ProductRecommendation> findBySourceProductIdOrderByDisplayOrderAsc(Long sourceProductId);
    Optional<ProductRecommendation> findBySourceProductIdAndRecommendedProductId(Long sourceProductId, Long recommendedProductId);
    void deleteBySourceProductIdAndRecommendedProductId(Long sourceProductId, Long recommendedProductId);
}
