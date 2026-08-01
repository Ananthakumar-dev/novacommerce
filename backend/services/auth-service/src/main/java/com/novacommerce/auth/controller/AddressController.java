package com.novacommerce.auth.controller;

import com.novacommerce.auth.dto.AddressRequest;
import com.novacommerce.auth.dto.AddressResponse;
import com.novacommerce.auth.entity.User;
import com.novacommerce.auth.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public List<AddressResponse> getAddresses(@AuthenticationPrincipal User user) {
        return addressService.getAddresses(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AddressResponse createAddress(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddressRequest request) {
        return addressService.createAddress(user, request);
    }

    @PutMapping("/{id}")
    public AddressResponse updateAddress(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        return addressService.updateAddress(user, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        addressService.deleteAddress(user, id);
    }

    @PatchMapping("/{id}/default")
    public AddressResponse setDefaultAddress(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return addressService.setDefaultAddress(user, id);
    }
}
