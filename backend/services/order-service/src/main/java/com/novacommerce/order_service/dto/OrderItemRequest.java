package com.novacommerce.order_service.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemRequest {
    private Long productId;
    private String productName;
    private String productSku;
    private String productImageUrl;
    private BigDecimal price;
    private Integer quantity;
    private String color;
}
