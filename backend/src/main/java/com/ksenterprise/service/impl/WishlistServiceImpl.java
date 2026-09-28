package com.ksenterprise.service.impl;

import com.ksenterprise.dto.response.WishlistResponseDTO;
import com.ksenterprise.exception.ResourceNotFoundException;
import com.ksenterprise.model.Product;
import com.ksenterprise.model.User;
import com.ksenterprise.model.Wishlist;
import com.ksenterprise.repository.ProductRepository;
import com.ksenterprise.repository.UserRepository;
import com.ksenterprise.repository.WishlistRepository;
import com.ksenterprise.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponseDTO> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(item -> WishlistResponseDTO.builder()
                        .wishlistId(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productSlug(item.getProduct().getSlug())
                        .price(item.getProduct().getPrice().toString())
                        .primaryImage(item.getProduct().getPrimaryImage())
                        .categoryName(item.getProduct().getCategory() != null ? item.getProduct().getCategory().getName() : "")
                        .availability(item.getProduct().getAvailability().name())
                        .addedAt(item.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

            Wishlist item = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();

            wishlistRepository.save(item);
        }
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }
}
