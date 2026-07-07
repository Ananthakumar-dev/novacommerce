package com.novacommerce.product.exception;

public class BrandInUseException extends RuntimeException {
    public BrandInUseException(String message) {
        super(message);
    }
}
