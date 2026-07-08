package com.novacommerce.product.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.novacommerce.product.dto.InventoryItemResponse;
import com.novacommerce.product.dto.StockAdjustmentRequest;
import com.novacommerce.product.dto.StockMovementResponse;
import com.novacommerce.product.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/inventory")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminInventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public List<InventoryItemResponse> listInventory() {
        return inventoryService.listInventory();
    }

    @GetMapping("/movements")
    public List<StockMovementResponse> listMovements(@RequestParam(required = false) Long productId) {
        return inventoryService.listMovements(productId);
    }

    @PostMapping("/{productId}/adjust")
    public InventoryItemResponse adjustStock(@PathVariable Long productId,
                                             @Valid @RequestBody StockAdjustmentRequest request) {
        return inventoryService.adjustStock(productId, request);
    }
}
