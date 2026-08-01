package com.novacommerce.order_service.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
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
import org.springframework.web.server.ResponseStatusException;

import com.novacommerce.order_service.dto.ShippingMethodResponse;
import com.novacommerce.order_service.entity.ShippingMethod;
import com.novacommerce.order_service.repository.ShippingMethodRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingMethodRepository shippingMethodRepository;

    @GetMapping("/shipping-methods")
    public List<ShippingMethodResponse> getShippingMethods(@RequestParam(required = false) BigDecimal subtotal) {
        List<ShippingMethod> methods = shippingMethodRepository.findByIsActiveTrue();
        return methods.stream().map(m -> {
            boolean isFree = false;
            BigDecimal calculatedRate = m.getBaseRate();

            if (subtotal != null && m.getMinOrderValueForFreeShipping() != null) {
                if (subtotal.compareTo(m.getMinOrderValueForFreeShipping()) >= 0) {
                    calculatedRate = BigDecimal.ZERO;
                    isFree = true;
                }
            }

            return ShippingMethodResponse.builder()
                    .id(m.getId())
                    .name(m.getName())
                    .carrier(m.getCarrier())
                    .baseRate(m.getBaseRate())
                    .calculatedRate(calculatedRate)
                    .minOrderValueForFreeShipping(m.getMinOrderValueForFreeShipping())
                    .estimatedDeliveryDays(m.getEstimatedDeliveryDays())
                    .isFree(isFree)
                    .isActive(m.isActive())
                    .build();
        }).collect(Collectors.toList());
    }

    @GetMapping("/admin/shipping-methods")
    public List<ShippingMethod> getAllShippingMethods() {
        return shippingMethodRepository.findAll();
    }

    @PostMapping("/admin/shipping-methods")
    @ResponseStatus(HttpStatus.CREATED)
    public ShippingMethod createShippingMethod(@RequestBody ShippingMethod method) {
        return shippingMethodRepository.save(method);
    }

    @PutMapping("/admin/shipping-methods/{id}")
    public ShippingMethod updateShippingMethod(@PathVariable Long id, @RequestBody ShippingMethod updated) {
        return shippingMethodRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setCarrier(updated.getCarrier());
            existing.setBaseRate(updated.getBaseRate());
            existing.setMinOrderValueForFreeShipping(updated.getMinOrderValueForFreeShipping());
            existing.setEstimatedDeliveryDays(updated.getEstimatedDeliveryDays());
            existing.setActive(updated.isActive());
            return shippingMethodRepository.save(existing);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipping method not found"));
    }

    @DeleteMapping("/admin/shipping-methods/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShippingMethod(@PathVariable Long id) {
        if (!shippingMethodRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipping method not found");
        }
        shippingMethodRepository.deleteById(id);
    }
}
