package com.novacommerce.product.service;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.novacommerce.product.config.ProductOptions;
import com.novacommerce.product.dto.ProductOptionsResponse;
import com.novacommerce.product.dto.ProductRequest;
import com.novacommerce.product.dto.ProductResponse;
import com.novacommerce.product.entity.Product;
import com.novacommerce.product.enums.ProductStatus;
import com.novacommerce.product.exception.DuplicateProductException;
import com.novacommerce.product.exception.InvalidProductOptionException;
import com.novacommerce.product.exception.ProductNotFoundException;
import com.novacommerce.product.repository.CategoryRepository;
import com.novacommerce.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final Pattern NON_SLUG_CHARS = Pattern.compile("[^a-z0-9]+");

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductResponse> listProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse getProduct(Long id) {
        return ProductResponse.from(findProduct(id));
    }

    public ProductResponse createProduct(ProductRequest request) {
        validateOptions(request);
        var slug = resolveSlug(request.getSlug(), request.getName());
        var sku = normalizeRequired(request.getSku());

        if (productRepository.existsBySkuIgnoreCase(sku)) {
            throw new DuplicateProductException("A product with this SKU already exists");
        }

        if (productRepository.existsBySlugIgnoreCase(slug)) {
            throw new DuplicateProductException("A product with this slug already exists");
        }

        var product = Product.builder()
                .name(normalizeRequired(request.getName()))
                .slug(slug)
                .description(normalizeOptional(request.getDescription()))
                .shortDescription(normalizeOptional(request.getShortDescription()))
                .sku(sku)
                .price(request.getPrice())
                .salePrice(request.getSalePrice())
                .stockQuantity(request.getStockQuantity())
                .lowStockThreshold(request.getLowStockThreshold() == null ? 0 : request.getLowStockThreshold())
                .status(request.getStatus() == null ? ProductStatus.DRAFT : request.getStatus())
                .category(normalizeRequired(request.getCategory()))
                .brand(normalizeRequired(request.getBrand()))
                .imageUrl(normalizeOptional(request.getImageUrl()))
                .featured(Boolean.TRUE.equals(request.getFeatured()))
                .metaTitle(normalizeOptional(request.getMetaTitle()))
                .metaDescription(normalizeOptional(request.getMetaDescription()))
                .build();

        return ProductResponse.from(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        var product = findProduct(id);
        validateOptions(request);
        var slug = resolveSlug(request.getSlug(), request.getName());
        var sku = normalizeRequired(request.getSku());

        if (productRepository.existsBySkuIgnoreCaseAndIdNot(sku, id)) {
            throw new DuplicateProductException("A product with this SKU already exists");
        }

        if (productRepository.existsBySlugIgnoreCaseAndIdNot(slug, id)) {
            throw new DuplicateProductException("A product with this slug already exists");
        }

        product.setName(normalizeRequired(request.getName()));
        product.setSlug(slug);
        product.setDescription(normalizeOptional(request.getDescription()));
        product.setShortDescription(normalizeOptional(request.getShortDescription()));
        product.setSku(sku);
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setLowStockThreshold(request.getLowStockThreshold() == null ? 0 : request.getLowStockThreshold());
        product.setStatus(request.getStatus() == null ? ProductStatus.DRAFT : request.getStatus());
        product.setCategory(normalizeRequired(request.getCategory()));
        product.setBrand(normalizeRequired(request.getBrand()));
        product.setImageUrl(normalizeOptional(request.getImageUrl()));
        product.setFeatured(Boolean.TRUE.equals(request.getFeatured()));
        product.setMetaTitle(normalizeOptional(request.getMetaTitle()));
        product.setMetaDescription(normalizeOptional(request.getMetaDescription()));

        return ProductResponse.from(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        var product = findProduct(id);
        productRepository.delete(product);
    }

    public ProductOptionsResponse getProductOptions() {
        var statuses = Arrays.stream(ProductStatus.values())
                .map(ProductStatus::name)
                .toList();

        var categories = categoryRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(category -> category.getName())
                .toList();

        return new ProductOptionsResponse(categories, ProductOptions.BRANDS, statuses);
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private void validateOptions(ProductRequest request) {
        if (!categoryRepository.existsByNameIgnoreCaseAndActiveTrue(normalizeRequired(request.getCategory()))) {
            throw new InvalidProductOptionException("Invalid category selected");
        }

        if (!ProductOptions.BRANDS.contains(normalizeRequired(request.getBrand()))) {
            throw new InvalidProductOptionException("Invalid brand selected");
        }
    }

    private String resolveSlug(String slug, String name) {
        var source = normalizeOptional(slug);

        if (source == null) {
            source = normalizeRequired(name);
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
