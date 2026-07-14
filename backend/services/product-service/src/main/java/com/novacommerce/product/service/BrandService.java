package com.novacommerce.product.service;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.novacommerce.product.dto.BrandRequest;
import com.novacommerce.product.dto.BrandResponse;
import com.novacommerce.product.entity.Brand;
import com.novacommerce.product.exception.BrandInUseException;
import com.novacommerce.product.exception.BrandNotFoundException;
import com.novacommerce.product.exception.DuplicateBrandException;
import com.novacommerce.product.exception.InvalidProductOptionException;
import com.novacommerce.product.repository.BrandRepository;
import com.novacommerce.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandService {

    private static final Pattern NON_SLUG_CHARS = Pattern.compile("[^a-z0-9]+");

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    public List<BrandResponse> listBrands() {
        return brandRepository.findAllByOrderByNameAsc()
                .stream()
                .map(BrandResponse::from)
                .toList();
    }

    public BrandResponse getBrand(Long id) {
        return BrandResponse.from(findBrand(id));
    }

    public BrandResponse createBrand(BrandRequest request) {
        var name = normalizeRequired(request.getName());
        var slug = resolveSlug(request.getSlug(), name);

        if (brandRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateBrandException("A brand with this name already exists");
        }

        if (brandRepository.existsBySlugIgnoreCase(slug)) {
            throw new DuplicateBrandException("A brand with this slug already exists");
        }

        var brand = Brand.builder()
                .name(name)
                .slug(slug)
                .description(normalizeOptional(request.getDescription()))
                .image(normalizeOptional(request.getImage()))
                .active(request.getActive() == null || request.getActive())
                .build();

        return BrandResponse.from(brandRepository.save(brand));
    }

    public BrandResponse updateBrand(Long id, BrandRequest request) {
        var brand = findBrand(id);
        var name = normalizeRequired(request.getName());
        var slug = resolveSlug(request.getSlug(), name);

        if (brandRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new DuplicateBrandException("A brand with this name already exists");
        }

        if (brandRepository.existsBySlugIgnoreCaseAndIdNot(slug, id)) {
            throw new DuplicateBrandException("A brand with this slug already exists");
        }

        brand.setName(name);
        brand.setSlug(slug);
        brand.setDescription(normalizeOptional(request.getDescription()));
        brand.setImage(normalizeOptional(request.getImage()));
        brand.setActive(request.getActive() == null || request.getActive());

        return BrandResponse.from(brandRepository.save(brand));
    }

    public void deleteBrand(Long id) {
        var brand = findBrand(id);

        if (productRepository.existsByBrandIgnoreCase(brand.getName())) {
            throw new BrandInUseException("Brand is assigned to one or more products");
        }

        brandRepository.delete(brand);
    }

    private Brand findBrand(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFoundException(id));
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
