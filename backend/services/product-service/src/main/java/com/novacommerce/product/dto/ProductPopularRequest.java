package com.novacommerce.product.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductPopularRequest {
    @NotNull(message = "Popular value is required")
    private Boolean popular;
}
