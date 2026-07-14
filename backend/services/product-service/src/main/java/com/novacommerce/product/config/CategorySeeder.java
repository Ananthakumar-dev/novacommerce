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
            var existing = categoryRepository.findByNameIgnoreCase(name);
            if (existing.isPresent()) {
                var category = existing.get();
                if (category.getIcon() == null || category.getIcon().isBlank()) {
                    category.setIcon(defaultIcon(name));
                    categoryRepository.save(category);
                }
            } else {
                categoryRepository.save(Category.builder()
                        .name(name)
                        .slug(slugify(name))
                        .icon(defaultIcon(name))
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

    private String defaultIcon(String name) {
        return switch (name) {
            case "Electronics" -> "Smartphone";
            case "Fashion" -> "Shirt";
            case "Home & Kitchen" -> "House";
            case "Beauty & Personal Care" -> "Sparkles";
            case "Sports & Fitness" -> "Dumbbell";
            case "Books" -> "BookOpen";
            case "Toys & Games" -> "Gamepad2";
            case "Grocery" -> "ShoppingBasket";
            case "Automotive" -> "Car";
            case "Health" -> "HeartPulse";
            default -> "FolderTree";
        };
    }
}
