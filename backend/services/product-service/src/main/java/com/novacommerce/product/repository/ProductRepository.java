package com.novacommerce.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.novacommerce.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySkuIgnoreCase(String sku);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
}
