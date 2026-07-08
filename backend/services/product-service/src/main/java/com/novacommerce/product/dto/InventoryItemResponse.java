package com.novacommerce.product.dto;

import java.math.BigDecimal;

import com.novacommerce.product.entity.Product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryItemResponse {
    private Long productId;
    private String productName;
    private String sku;
    private String category;
    private String brand;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
    private String stockStatus;

    public static InventoryItemResponse from(Product product) {
        var stockQuantity = product.getStockQuantity();
        var lowStockThreshold = product.getLowStockThreshold();

        return InventoryItemResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .sku(product.getSku())
                .category(product.getCategory())
                .brand(product.getBrand())
                .price(product.getPrice())
                .salePrice(product.getSalePrice())
                .stockQuantity(stockQuantity)
                .lowStockThreshold(lowStockThreshold)
                .stockStatus(resolveStockStatus(stockQuantity, lowStockThreshold))
                .build();
    }

    private static String resolveStockStatus(Integer stockQuantity, Integer lowStockThreshold) {
        if (stockQuantity == null || stockQuantity <= 0) {
            return "OUT_OF_STOCK";
        }

        if (lowStockThreshold != null && stockQuantity <= lowStockThreshold) {
            return "LOW_STOCK";
        }

        return "IN_STOCK";
    }
}
