package com.novacommerce.order_service.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.novacommerce.order_service.dto.OrderRequest;
import com.novacommerce.order_service.entity.Order;
import com.novacommerce.order_service.entity.OrderItem;
import com.novacommerce.order_service.entity.ShippingMethod;
import com.novacommerce.order_service.enums.OrderStatus;
import com.novacommerce.order_service.repository.OrderRepository;
import com.novacommerce.order_service.repository.ShippingMethodRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final ShippingMethodRepository shippingMethodRepository;

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public Order placeOrder(Principal principal, @RequestBody OrderRequest request) {
        String email = principal.getName();

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must contain at least one item");
        }

        // Fetch selected shipping method details
        ShippingMethod shippingMethod = shippingMethodRepository.findById(request.getShippingMethodId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid shipping method selected"));

        // Calculate Subtotal
        BigDecimal subtotal = request.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate Shipping Fee based on logic (Free shipping threshold check)
        BigDecimal shippingCost = shippingMethod.getBaseRate();
        if (shippingMethod.getMinOrderValueForFreeShipping() != null) {
            if (subtotal.compareTo(shippingMethod.getMinOrderValueForFreeShipping()) >= 0) {
                shippingCost = BigDecimal.ZERO;
            }
        }

        // Tax calculation: 18% GST (consistent with storefront UI calculations)
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.18")).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(shippingCost).add(tax);

        // Generate a random human-readable Order Number
        String orderNumber = "NC-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 900 + 100);

        Order order = Order.builder()
                .userEmail(email)
                .orderNumber(orderNumber)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .streetAddress(request.getStreetAddress())
                .apartment(request.getApartment())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .shippingMethodName(shippingMethod.getName())
                .shippingCost(shippingCost)
                .subtotal(subtotal)
                .tax(tax)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .build();

        // Map child items
        List<OrderItem> orderItems = request.getItems().stream().map(itemReq -> 
            OrderItem.builder()
                    .order(order)
                    .productId(itemReq.getProductId())
                    .productName(itemReq.getProductName())
                    .productSku(itemReq.getProductSku())
                    .productImageUrl(itemReq.getProductImageUrl())
                    .price(itemReq.getPrice())
                    .quantity(itemReq.getQuantity())
                    .color(itemReq.getColor())
                    .build()
        ).collect(Collectors.toList());

        order.setItems(orderItems);

        return orderRepository.save(order);
    }

    @GetMapping("/orders")
    @PreAuthorize("isAuthenticated()")
    public List<Order> getCustomerOrders(Principal principal) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(principal.getName());
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("isAuthenticated()")
    public Order getOrderDetails(Principal principal, @PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Only allow owner of the order to fetch it (or admin user)
        // Note: The auth token role can be ADMIN or CUSTOMER.
        // For simplicity: verify email matches or allow admin role (we can check if current authorities contain ROLE_ADMIN)
        boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !order.getUserEmail().equalsIgnoreCase(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access is denied");
        }

        return order;
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
}
