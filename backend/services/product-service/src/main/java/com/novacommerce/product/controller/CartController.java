package com.novacommerce.product.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.novacommerce.product.dto.CartItemRequest;
import com.novacommerce.product.dto.CartResponse;
import com.novacommerce.product.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/storefront/cart")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(Principal principal) {
        return cartService.getCart(principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addToCart(Principal principal, @Valid @RequestBody CartItemRequest request) {
        return cartService.addToCart(principal.getName(), request);
    }

    @PutMapping("/{itemId}")
    public CartResponse updateQuantity(Principal principal, 
                                       @PathVariable Long itemId, 
                                       @RequestParam int quantity) {
        return cartService.updateQuantity(principal.getName(), itemId, quantity);
    }

    @DeleteMapping("/{itemId}")
    public CartResponse removeItem(Principal principal, @PathVariable Long itemId) {
        return cartService.removeItem(principal.getName(), itemId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
    }
}
