package com.ksenterprise.service;

import com.ksenterprise.dto.request.ProductRequestDTO;
import com.ksenterprise.dto.response.CategoryResponseDTO;
import com.ksenterprise.dto.response.ProductDetailResponseDTO;
import com.ksenterprise.dto.response.ProductResponseDTO;
import com.ksenterprise.model.Availability;

import java.util.List;

public interface ProductService {
    List<ProductResponseDTO> getAllProducts();
    List<ProductResponseDTO> getFeaturedProducts();
    ProductDetailResponseDTO getProductById(Long id);
    ProductDetailResponseDTO getProductBySlug(String slug);
    List<ProductResponseDTO> getProductsByCategory(Long categoryId);
    List<CategoryResponseDTO> getAllCategories();

    // Admin Operations
    ProductResponseDTO createProduct(ProductRequestDTO request);
    ProductResponseDTO updateProduct(Long id, ProductRequestDTO request);
    void deleteProduct(Long id);
    ProductResponseDTO updateStockStatus(Long id, Availability availability);
}
