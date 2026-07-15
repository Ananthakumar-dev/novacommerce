package com.novacommerce.product.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductPageResponse {
    private List<ProductResponse> items;
    private int page;
    private int size;
    private long totalItems;
    private int totalPages;
}
