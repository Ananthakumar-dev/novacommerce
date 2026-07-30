package com.novacommerce.product.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.novacommerce.product.dto.CartItemRequest;
import com.novacommerce.product.dto.CartItemResponse;
import com.novacommerce.product.dto.CartResponse;
import com.novacommerce.product.entity.CartItem;
import com.novacommerce.product.exception.CartItemNotFoundException;
import com.novacommerce.product.exception.ProductNotFoundException;
import com.novacommerce.product.repository.CartItemRepository;
import com.novacommerce.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        List<CartItem> items = cartItemRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
        
        List<CartItemResponse> itemResponses = items.stream()
                .map(CartItemResponse::from)
                .toList();

        BigDecimal subtotal = items.stream()
                .map(item -> {
                    BigDecimal unitPrice = item.getProduct().getSalePrice() != null 
                            ? item.getProduct().getSalePrice() 
                            : item.getProduct().getPrice();
                    return unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartResponse.builder()
                .items(itemResponses)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }

    public CartResponse addToCart(String email, CartItemRequest request) {
        var product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Requested quantity " + request.getQuantity() + " exceeds available stock (" + product.getStockQuantity() + ")");
        }

        var existingItemOpt = cartItemRepository.findByCustomerEmailAndProductIdAndColor(
                email, request.getProductId(), request.getColor());

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new IllegalArgumentException("Total requested quantity " + newQuantity + " exceeds available stock (" + product.getStockQuantity() + ")");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .customerEmail(email)
                    .product(product)
                    .quantity(request.getQuantity())
                    .color(request.getColor())
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(email);
    }

    public CartResponse updateQuantity(String email, Long itemId, int quantity) {
        var item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCustomerEmail().equals(email)) {
            throw new CartItemNotFoundException("Cart item not found for the current user");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            var product = item.getProduct();
            if (product.getStockQuantity() < quantity) {
                throw new IllegalArgumentException("Requested quantity " + quantity + " exceeds available stock (" + product.getStockQuantity() + ")");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart(email);
    }

    public CartResponse removeItem(String email, Long itemId) {
        var item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCustomerEmail().equals(email)) {
            throw new CartItemNotFoundException("Cart item not found for the current user");
        }

        cartItemRepository.delete(item);
        return getCart(email);
    }

    public void clearCart(String email) {
        cartItemRepository.deleteByCustomerEmail(email);
    }
}
