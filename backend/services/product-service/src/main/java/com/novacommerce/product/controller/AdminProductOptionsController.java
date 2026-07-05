package com.novacommerce.product.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.novacommerce.product.dto.ProductOptionsResponse;
import com.novacommerce.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/product-options")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminProductOptionsController {

    private final ProductService productService;

    @GetMapping
    public ProductOptionsResponse getProductOptions() {
        return productService.getProductOptions();
    }
}
