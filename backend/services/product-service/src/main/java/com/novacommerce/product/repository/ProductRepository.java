package com.novacommerce.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.novacommerce.product.entity.Product;
import com.novacommerce.product.enums.ProductStatus;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);

    List<Product> findByMerchantId(Long merchantId);

    Page<Product> findByMerchantId(Long merchantId, Pageable pageable);

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
