package com.novacommerce.product.exception;

public class DuplicateCategoryException extends RuntimeException {
    public DuplicateCategoryException(String message) {
        super(message);
    }
}
