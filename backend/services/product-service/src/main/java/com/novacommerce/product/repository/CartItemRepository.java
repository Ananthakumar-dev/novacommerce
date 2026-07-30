package com.novacommerce.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.novacommerce.product.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    Optional<CartItem> findByCustomerEmailAndProductIdAndColor(String customerEmail, Long productId, String color);

    void deleteByCustomerEmail(String customerEmail);
}
