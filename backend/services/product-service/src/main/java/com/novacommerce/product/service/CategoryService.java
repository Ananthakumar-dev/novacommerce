package com.novacommerce.product.service;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.novacommerce.product.dto.CategoryRequest;
import com.novacommerce.product.dto.CategoryResponse;
import com.novacommerce.product.entity.Category;
import com.novacommerce.product.exception.CategoryInUseException;
import com.novacommerce.product.exception.CategoryNotFoundException;
import com.novacommerce.product.exception.DuplicateCategoryException;
import com.novacommerce.product.exception.InvalidProductOptionException;
import com.novacommerce.product.repository.CategoryRepository;
import com.novacommerce.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private static final Pattern NON_SLUG_CHARS = Pattern.compile("[^a-z0-9]+");

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public List<CategoryResponse> listCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public CategoryResponse getCategory(Long id) {
        return CategoryResponse.from(findCategory(id));
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        var name = normalizeRequired(request.getName());
        var slug = resolveSlug(request.getSlug(), name);

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateCategoryException("A category with this name already exists");
        }

        if (categoryRepository.existsBySlugIgnoreCase(slug)) {
            throw new DuplicateCategoryException("A category with this slug already exists");
        }

        var category = Category.builder()
                .name(name)
                .slug(slug)
                .description(normalizeOptional(request.getDescription()))
                .active(request.getActive() == null || request.getActive())
                .build();

        return CategoryResponse.from(categoryRepository.save(category));
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        var category = findCategory(id);
        var name = normalizeRequired(request.getName());
        var slug = resolveSlug(request.getSlug(), name);

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new DuplicateCategoryException("A category with this name already exists");
        }

        if (categoryRepository.existsBySlugIgnoreCaseAndIdNot(slug, id)) {
            throw new DuplicateCategoryException("A category with this slug already exists");
        }

        category.setName(name);
        category.setSlug(slug);
        category.setDescription(normalizeOptional(request.getDescription()));
        category.setActive(request.getActive() == null || request.getActive());

        return CategoryResponse.from(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        var category = findCategory(id);

        if (productRepository.existsByCategoryIgnoreCase(category.getName())) {
            throw new CategoryInUseException("Category is assigned to one or more products");
        }

        categoryRepository.delete(category);
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }

    private String resolveSlug(String slug, String name) {
        var source = normalizeOptional(slug);

        if (source == null) {
            source = name;
        }

        var normalized = NON_SLUG_CHARS.matcher(source.toLowerCase(Locale.ROOT).trim())
                .replaceAll("-")
                .replaceAll("(^-|-$)", "");

        if (normalized.isBlank()) {
            throw new InvalidProductOptionException("Slug must contain at least one letter or number");
        }

        return normalized;
    }

    private String normalizeRequired(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeOptional(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}
