package com.novacommerce.product.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.novacommerce.product.entity.Product;
import com.novacommerce.product.enums.ProductStatus;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByStatusOrderByCreatedAtDesc(ProductStatus status, Pageable pageable);

    List<Product> findByStatusAndPopularTrueOrderByUpdatedAtDesc(ProductStatus status, Pageable pageable);

    List<Product> findByStatusAndFeaturedTrueOrderByUpdatedAtDesc(ProductStatus status, Pageable pageable);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsByCategoryIgnoreCase(String category);

    boolean existsByBrandIgnoreCase(String brand);

    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
}
