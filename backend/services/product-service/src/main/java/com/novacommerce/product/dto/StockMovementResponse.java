package com.novacommerce.product.dto;

import java.time.LocalDateTime;

import com.novacommerce.product.entity.StockMovement;
import com.novacommerce.product.enums.StockMovementType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockMovementResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String sku;
    private StockMovementType type;
    private Integer quantity;
    private Integer stockBefore;
    private Integer stockAfter;
    private String reason;
    private String reference;
    private LocalDateTime createdAt;

    public static StockMovementResponse from(StockMovement movement) {
        var product = movement.getProduct();

        return StockMovementResponse.builder()
                .id(movement.getId())
                .productId(product.getId())
                .productName(product.getName())
                .sku(product.getSku())
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .stockBefore(movement.getStockBefore())
                .stockAfter(movement.getStockAfter())
                .reason(movement.getReason())
                .reference(movement.getReference())
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
