package com.novacommerce.product.dto;

import java.math.BigDecimal;
import com.novacommerce.product.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private String productImageUrl;
    private BigDecimal price;
    private BigDecimal salePrice;
    private int quantity;
    private String color;
    private int stockQuantity;

    public static CartItemResponse from(CartItem item) {
        var product = item.getProduct();
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productSlug(product.getSlug())
                .productImageUrl(product.getImageUrl())
                .price(product.getPrice())
                .salePrice(product.getSalePrice())
                .quantity(item.getQuantity())
                .color(item.getColor())
                .stockQuantity(product.getStockQuantity())
                .build();
    }
}
