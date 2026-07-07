package com.novacommerce.product.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.novacommerce.product.entity.Brand;
import com.novacommerce.product.repository.BrandRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BrandSeeder implements CommandLineRunner {

    private final BrandRepository brandRepository;

    @Override
    public void run(String... args) {
        ProductOptions.BRANDS.forEach(name -> {
            if (!brandRepository.existsByNameIgnoreCase(name)) {
                brandRepository.save(Brand.builder()
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
