package com.novacommerce.product.dto;

import java.math.BigDecimal;

import com.novacommerce.product.enums.ProductStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String slug;

    private String description;

    @Size(max = 500, message = "Short description must be 500 characters or less")
    private String shortDescription;

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price must be zero or greater")
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Sale price must be zero or greater")
    private BigDecimal salePrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be zero or greater")
    private Integer stockQuantity;

    @Min(value = 0, message = "Low stock threshold must be zero or greater")
    private Integer lowStockThreshold;

    private ProductStatus status;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Brand is required")
    private String brand;

    private String imageUrl;

    private Boolean featured;

    private String metaTitle;

    @Size(max = 500, message = "Meta description must be 500 characters or less")
    private String metaDescription;
}
