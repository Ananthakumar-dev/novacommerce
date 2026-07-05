package com.novacommerce.product.config;

import java.util.List;

public final class ProductOptions {
    public static final List<String> CATEGORIES = List.of(
            "Electronics",
            "Fashion",
            "Home & Kitchen",
            "Beauty & Personal Care",
            "Sports & Fitness",
            "Books",
            "Toys & Games",
            "Grocery",
            "Automotive",
            "Health");

    public static final List<String> BRANDS = List.of(
            "Apple",
            "Samsung",
            "Sony",
            "Nike",
            "Adidas",
            "Puma",
            "LG",
            "Dell",
            "HP",
            "Lenovo",
            "Philips",
            "Generic");

    private ProductOptions() {
    }
}
