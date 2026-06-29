package com.novacommerce.auth.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleProbeController {

    @GetMapping("/api/admin/ping")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> adminPing() {
        return Map.of("message", "ADMIN access granted");
    }

    @GetMapping("/api/merchant/ping")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public Map<String, String> merchantPing() {
        return Map.of("message", "MERCHANT access granted");
    }

    @GetMapping("/api/customer/ping")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public Map<String, String> customerPing() {
        return Map.of("message", "CUSTOMER access granted");
    }
}
