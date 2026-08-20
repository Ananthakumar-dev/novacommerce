package com.novacommerce.product.security;

import java.security.Principal;

public record SecurityUser(Long id, String email, String role) implements Principal {
    @Override
    public String getName() {
        return email;
    }
}
