package com.novacommerce.product.dto;

import com.novacommerce.product.enums.StockMovementType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StockAdjustmentRequest {
    @NotNull(message = "Adjustment type is required")
    private StockMovementType type;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be zero or greater")
    private Integer quantity;

    @Size(max = 500, message = "Reason must be 500 characters or less")
    private String reason;

    private String reference;
}
