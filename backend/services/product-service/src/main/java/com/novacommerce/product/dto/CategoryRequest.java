package com.novacommerce.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    private String slug;

    @Size(max = 500, message = "Description must be 500 characters or less")
    private String description;

    private Boolean active;
}
