package com.novacommerce.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.novacommerce.product.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByOrderByNameAsc();

    List<Category> findByActiveTrueOrderByNameAsc();

    Optional<Category> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsByNameIgnoreCaseAndActiveTrue(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
}
