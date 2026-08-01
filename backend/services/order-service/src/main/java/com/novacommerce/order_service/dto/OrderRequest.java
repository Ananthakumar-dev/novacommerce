package com.novacommerce.order_service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private String fullName;
    private String phoneNumber;
    private String streetAddress;
    private String apartment;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Long shippingMethodId;
    private List<OrderItemRequest> items;
}
