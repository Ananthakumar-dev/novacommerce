package com.novacommerce.product.exception;

public class InvalidStockAdjustmentException extends RuntimeException {
    public InvalidStockAdjustmentException(String message) {
        super(message);
    }
}
