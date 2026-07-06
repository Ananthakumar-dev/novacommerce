package com.novacommerce.product.exception;

public class CategoryInUseException extends RuntimeException {
    public CategoryInUseException(String message) {
        super(message);
    }
}
