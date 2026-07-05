package com.novacommerce.product.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductOptionsResponse {
    private List<String> categories;
    private List<String> brands;
    private List<String> statuses;
}
