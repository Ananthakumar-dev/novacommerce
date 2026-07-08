package com.novacommerce.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.novacommerce.product.entity.StockMovement;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<StockMovement> findTop50ByOrderByCreatedAtDesc();
}
