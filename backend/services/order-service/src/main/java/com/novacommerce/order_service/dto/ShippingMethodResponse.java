package com.novacommerce.order_service.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShippingMethodResponse {
    private Long id;
    private String name;
    private String carrier;
    private BigDecimal baseRate;
    private BigDecimal calculatedRate;
    private BigDecimal minOrderValueForFreeShipping;
    private Integer estimatedDeliveryDays;
    private boolean isFree;
    private boolean isActive;
}
