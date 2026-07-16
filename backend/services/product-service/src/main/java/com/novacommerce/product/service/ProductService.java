package com.novacommerce.product.service;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.novacommerce.product.dto.ProductPageResponse;
import com.novacommerce.product.dto.ProductPopularRequest;
import com.novacommerce.product.dto.ProductOptionsResponse;
import com.novacommerce.product.dto.ProductRequest;
import com.novacommerce.product.dto.ProductResponse;
import com.novacommerce.product.entity.Product;
import com.novacommerce.product.enums.ProductStatus;
import com.novacommerce.product.exception.DuplicateProductException;
import com.novacommerce.product.exception.InvalidProductOptionException;
import com.novacommerce.product.exception.ProductNotFoundException;
import com.novacommerce.product.repository.BrandRepository;
import com.novacommerce.product.repository.CategoryRepository;
import com.novacommerce.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final Pattern NON_SLUG_CHARS = Pattern.compile("[^a-z0-9]+");

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductPageResponse listProducts(int page, int size) {
        var safePage = Math.max(page, 0);
        var safeSize = Math.min(Math.max(size, 1), 50);
        var pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        var products = productRepository.findAll(pageable);
        var items = products.getContent()
                .stream()
                .map(ProductResponse::from)
                .toList();

        return new ProductPageResponse(items, products.getNumber(), products.getSize(),
                products.getTotalElements(), products.getTotalPages());
    }

    public ProductResponse getProduct(Long id) {
        return ProductResponse.from(findProduct(id));
    }

    public List<ProductResponse> listStorefrontProducts(int size) {
        return productRepository
                .findByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE, storefrontPage(size))
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductPageResponse listStorefrontCatalog(String query,
                                                     String category,
                                                     String brand,
                                                     BigDecimal minPrice,
                                                     BigDecimal maxPrice,
                                                     Boolean inStock,
                                                     String sort,
                                                     int page,
                                                     int size) {
        var safePage = Math.max(page, 0);
        var safeSize = Math.min(Math.max(size, 1), 48);
        var pageable = PageRequest.of(safePage, safeSize, resolveStorefrontSort(sort));
        var products = productRepository.findAll(
                storefrontCatalogSpec(query, category, brand, minPrice, maxPrice, inStock),
                pageable);

        return toPageResponse(products);
    }

    public List<ProductResponse> listPopularProducts(int size) {
        return productRepository
                .findByStatusAndPopularTrueOrderByUpdatedAtDesc(ProductStatus.ACTIVE, storefrontPage(size))
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public List<ProductResponse> listFeaturedProducts(int size) {
        return productRepository
                .findByStatusAndFeaturedTrueOrderByUpdatedAtDesc(ProductStatus.ACTIVE, storefrontPage(size))
                .stream()
                .map(ProductResponse::from)
                .toList();
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
                .popular(Boolean.TRUE.equals(request.getPopular()))
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
        product.setPopular(Boolean.TRUE.equals(request.getPopular()));
        product.setMetaTitle(normalizeOptional(request.getMetaTitle()));
        product.setMetaDescription(normalizeOptional(request.getMetaDescription()));

        return ProductResponse.from(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        var product = findProduct(id);
        productRepository.delete(product);
    }

    public ProductResponse updatePopular(Long id, ProductPopularRequest request) {
        var product = findProduct(id);
        product.setPopular(Boolean.TRUE.equals(request.getPopular()));

        return ProductResponse.from(productRepository.save(product));
    }

    public ProductOptionsResponse getProductOptions() {
        var statuses = Arrays.stream(ProductStatus.values())
                .map(ProductStatus::name)
                .toList();

        var categories = categoryRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(category -> category.getName())
                .toList();

        var brands = brandRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(brand -> brand.getName())
                .toList();

        return new ProductOptionsResponse(categories, brands, statuses);
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private PageRequest storefrontPage(int size) {
        var safeSize = Math.min(Math.max(size, 1), 24);
        return PageRequest.of(0, safeSize);
    }

    private ProductPageResponse toPageResponse(Page<Product> products) {
        var items = products.getContent()
                .stream()
                .map(ProductResponse::from)
                .toList();

        return new ProductPageResponse(items, products.getNumber(), products.getSize(),
                products.getTotalElements(), products.getTotalPages());
    }

    private Sort resolveStorefrontSort(String sort) {
        var normalized = normalizeOptional(sort);

        if ("price-asc".equalsIgnoreCase(normalized)) {
            return Sort.by(Sort.Direction.ASC, "salePrice").and(Sort.by(Sort.Direction.ASC, "price"));
        }

        if ("price-desc".equalsIgnoreCase(normalized)) {
            return Sort.by(Sort.Direction.DESC, "salePrice").and(Sort.by(Sort.Direction.DESC, "price"));
        }

        if ("name-asc".equalsIgnoreCase(normalized)) {
            return Sort.by(Sort.Direction.ASC, "name");
        }

        if ("popular".equalsIgnoreCase(normalized)) {
            return Sort.by(Sort.Direction.DESC, "popular")
                    .and(Sort.by(Sort.Direction.DESC, "updatedAt"));
        }

        return Sort.by(Sort.Direction.DESC, "createdAt");
    }

    private Specification<Product> storefrontCatalogSpec(String query,
                                                         String category,
                                                         String brand,
                                                         BigDecimal minPrice,
                                                         BigDecimal maxPrice,
                                                         Boolean inStock) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.ACTIVE));

            var normalizedQuery = normalizeOptional(query);
            if (normalizedQuery != null) {
                var pattern = "%" + normalizedQuery.toLowerCase(Locale.ROOT) + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("sku")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), pattern)));
            }

            var normalizedCategory = normalizeOptional(category);
            if (normalizedCategory != null) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")),
                        normalizedCategory.toLowerCase(Locale.ROOT)));
            }

            var normalizedBrand = normalizeOptional(brand);
            if (normalizedBrand != null) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("brand")),
                        normalizedBrand.toLowerCase(Locale.ROOT)));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (Boolean.TRUE.equals(inStock)) {
                predicates.add(criteriaBuilder.greaterThan(root.get("stockQuantity"), 0));
            }

            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private void validateOptions(ProductRequest request) {
        if (!categoryRepository.existsByNameIgnoreCaseAndActiveTrue(normalizeRequired(request.getCategory()))) {
            throw new InvalidProductOptionException("Invalid category selected");
        }

        if (!brandRepository.existsByNameIgnoreCaseAndActiveTrue(normalizeRequired(request.getBrand()))) {
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
