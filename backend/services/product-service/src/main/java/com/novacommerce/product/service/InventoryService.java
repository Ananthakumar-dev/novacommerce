package com.novacommerce.product.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.novacommerce.product.dto.InventoryItemResponse;
import com.novacommerce.product.dto.StockAdjustmentRequest;
import com.novacommerce.product.dto.StockMovementResponse;
import com.novacommerce.product.entity.Product;
import com.novacommerce.product.entity.StockMovement;
import com.novacommerce.product.enums.StockMovementType;
import com.novacommerce.product.exception.InvalidStockAdjustmentException;
import com.novacommerce.product.exception.ProductNotFoundException;
import com.novacommerce.product.repository.ProductRepository;
import com.novacommerce.product.repository.StockMovementRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public List<InventoryItemResponse> listInventory() {
        return productRepository.findAll()
                .stream()
                .map(InventoryItemResponse::from)
                .toList();
    }

    public List<StockMovementResponse> listMovements(Long productId) {
        var movements = productId == null
                ? stockMovementRepository.findTop50ByOrderByCreatedAtDesc()
                : stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId);

        return movements.stream()
                .map(StockMovementResponse::from)
                .toList();
    }

    @Transactional
    public InventoryItemResponse adjustStock(Long productId, StockAdjustmentRequest request) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        var stockBefore = product.getStockQuantity();
        var stockAfter = resolveStockAfter(stockBefore, request.getQuantity(), request.getType());

        product.setStockQuantity(stockAfter);
        var savedProduct = productRepository.save(product);

        stockMovementRepository.save(StockMovement.builder()
                .product(savedProduct)
                .type(request.getType())
                .quantity(request.getQuantity())
                .stockBefore(stockBefore)
                .stockAfter(stockAfter)
                .reason(normalizeOptional(request.getReason()))
                .reference(normalizeOptional(request.getReference()))
                .build());

        return InventoryItemResponse.from(savedProduct);
    }

    private Integer resolveStockAfter(Integer stockBefore, Integer quantity, StockMovementType type) {
        if (type == StockMovementType.ADD) {
            return stockBefore + quantity;
        }

        if (type == StockMovementType.REMOVE) {
            var stockAfter = stockBefore - quantity;
            if (stockAfter < 0) {
                throw new InvalidStockAdjustmentException("Stock cannot be reduced below zero");
            }

            return stockAfter;
        }

        return quantity;
    }

    private String normalizeOptional(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}
