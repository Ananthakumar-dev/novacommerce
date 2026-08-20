package com.novacommerce.product.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.novacommerce.product.dto.InventoryItemResponse;
import com.novacommerce.product.dto.StockAdjustmentRequest;
import com.novacommerce.product.dto.StockMovementResponse;
import com.novacommerce.product.security.SecurityUser;
import com.novacommerce.product.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/merchant/inventory")
@PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
@RequiredArgsConstructor
public class MerchantInventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public List<InventoryItemResponse> listInventory(@AuthenticationPrincipal SecurityUser user) {
        Long merchantId = resolveMerchantId(user);
        return inventoryService.listMerchantInventory(merchantId);
    }

    @GetMapping("/movements")
    public List<StockMovementResponse> listMovements(@AuthenticationPrincipal SecurityUser user,
                                                     @RequestParam(required = false) Long productId) {
        Long merchantId = resolveMerchantId(user);
        return inventoryService.listMerchantMovements(merchantId, productId);
    }

    @PostMapping("/{productId}/adjust")
    public InventoryItemResponse adjustStock(@AuthenticationPrincipal SecurityUser user,
                                             @PathVariable Long productId,
                                             @Valid @RequestBody StockAdjustmentRequest request) {
        Long merchantId = resolveMerchantId(user);
        return inventoryService.adjustMerchantStock(merchantId, productId, request);
    }

    private Long resolveMerchantId(SecurityUser user) {
        if (user == null || user.id() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Merchant identification is missing or invalid");
        }
        return user.id();
    }
}
