package com.novacommerce.product.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.novacommerce.product.entity.Category;
import com.novacommerce.product.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategorySeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        ProductOptions.CATEGORIES.forEach(name -> {
            if (!categoryRepository.existsByNameIgnoreCase(name)) {
                categoryRepository.save(Category.builder()
                        .name(name)
                        .slug(slugify(name))
                        .active(true)
                        .build());
            }
        });
    }

    private String slugify(String value) {
        return value.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}
