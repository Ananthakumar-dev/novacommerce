package com.novacommerce.product.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.novacommerce.product.dto.MediaUploadResponse;
import com.novacommerce.product.dto.ProductOptionsResponse;
import com.novacommerce.product.dto.ProductPageResponse;
import com.novacommerce.product.dto.ProductRequest;
import com.novacommerce.product.dto.ProductResponse;
import com.novacommerce.product.security.SecurityUser;
import com.novacommerce.product.service.MediaStorageService;
import com.novacommerce.product.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/merchant")
@PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
@RequiredArgsConstructor
public class MerchantProductController {

    private final ProductService productService;
    private final MediaStorageService mediaStorageService;

    @GetMapping("/products")
    public ProductPageResponse listProducts(@AuthenticationPrincipal SecurityUser user,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size) {
        Long merchantId = resolveMerchantId(user);
        return productService.listMerchantProducts(merchantId, page, size);
    }

    @GetMapping("/products/{id}")
    public ProductResponse getProduct(@AuthenticationPrincipal SecurityUser user,
                                      @PathVariable Long id) {
        Long merchantId = resolveMerchantId(user);
        return productService.getMerchantProduct(id, merchantId);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(@AuthenticationPrincipal SecurityUser user,
                                         @Valid @RequestBody ProductRequest request) {
        Long merchantId = resolveMerchantId(user);
        return productService.createMerchantProduct(merchantId, request);
    }

    @PutMapping("/products/{id}")
    public ProductResponse updateProduct(@AuthenticationPrincipal SecurityUser user,
                                         @PathVariable Long id,
                                         @Valid @RequestBody ProductRequest request) {
        Long merchantId = resolveMerchantId(user);
        return productService.updateMerchantProduct(id, merchantId, request);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@AuthenticationPrincipal SecurityUser user,
                              @PathVariable Long id) {
        Long merchantId = resolveMerchantId(user);
        productService.deleteMerchantProduct(id, merchantId);
    }

    @GetMapping("/product-options")
    public ProductOptionsResponse getProductOptions() {
        return productService.getProductOptions();
    }

    @PostMapping("/uploads")
    @ResponseStatus(HttpStatus.CREATED)
    public MediaUploadResponse upload(@RequestParam("file") MultipartFile file) {
        return new MediaUploadResponse(mediaStorageService.store(file));
    }

    private Long resolveMerchantId(SecurityUser user) {
        if (user == null || user.id() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Merchant identification is missing or invalid");
        }
        return user.id();
    }
}
