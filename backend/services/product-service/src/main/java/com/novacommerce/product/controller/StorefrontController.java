package com.novacommerce.product.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.novacommerce.product.dto.BrandResponse;
import com.novacommerce.product.dto.CategoryResponse;
import com.novacommerce.product.dto.ProductPageResponse;
import com.novacommerce.product.dto.ProductResponse;
import com.novacommerce.product.service.BrandService;
import com.novacommerce.product.service.CategoryService;
import com.novacommerce.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/storefront")
@RequiredArgsConstructor
public class StorefrontController {

    private final CategoryService categoryService;
    private final BrandService brandService;
    private final ProductService productService;

    @GetMapping("/categories")
    public List<CategoryResponse> listCategories() {
        return categoryService.listStorefrontCategories();
    }

    @GetMapping("/brands")
    public List<BrandResponse> listBrands() {
        return brandService.listStorefrontBrands();
    }

    @GetMapping("/products")
    public List<ProductResponse> listProducts(@RequestParam(defaultValue = "12") int size) {
        return productService.listStorefrontProducts(size);
    }

    @GetMapping("/products/catalog")
    public ProductPageResponse listProductCatalog(@RequestParam(required = false) String q,
                                                  @RequestParam(required = false) String category,
                                                  @RequestParam(required = false) String brand,
                                                  @RequestParam(required = false) BigDecimal minPrice,
                                                  @RequestParam(required = false) BigDecimal maxPrice,
                                                  @RequestParam(required = false) Boolean inStock,
                                                  @RequestParam(defaultValue = "newest") String sort,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "12") int size) {
        return productService.listStorefrontCatalog(q, category, brand, minPrice, maxPrice,
                inStock, sort, page, size);
    }

    @GetMapping("/products/popular")
    public List<ProductResponse> listPopularProducts(@RequestParam(defaultValue = "12") int size) {
        return productService.listPopularProducts(size);
    }

    @GetMapping("/products/featured")
    public List<ProductResponse> listFeaturedProducts(@RequestParam(defaultValue = "6") int size) {
        return productService.listFeaturedProducts(size);
    }
}
