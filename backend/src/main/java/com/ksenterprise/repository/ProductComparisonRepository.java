package com.ksenterprise.repository;

import com.ksenterprise.model.ProductComparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductComparisonRepository extends JpaRepository<ProductComparison, Long> {
    List<ProductComparison> findByBaseProductId(Long baseProductId);
}
