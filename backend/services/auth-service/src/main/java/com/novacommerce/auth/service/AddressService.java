package com.novacommerce.auth.service;

import com.novacommerce.auth.dto.AddressRequest;
import com.novacommerce.auth.dto.AddressResponse;
import com.novacommerce.auth.entity.Address;
import com.novacommerce.auth.entity.User;
import com.novacommerce.auth.exception.ResourceNotFoundException;
import com.novacommerce.auth.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    @Transactional(readOnly = true)
    public List<AddressResponse> getAddresses(User user) {
        return addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse createAddress(User user, AddressRequest request) {
        List<Address> existing = addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
        
        // If it's the first address, or the request specifies default, mark it as default
        boolean shouldBeDefault = existing.isEmpty() || request.isDefault();

        if (shouldBeDefault) {
            unsetExistingDefault(user);
        }

        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .streetAddress(request.getStreetAddress())
                .apartment(request.getApartment())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .isDefault(shouldBeDefault)
                .build();

        Address saved = addressRepository.save(address);
        return mapToResponse(saved);
    }

    @Transactional
    public AddressResponse updateAddress(User user, Long addressId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        boolean wasDefault = address.isDefault();
        boolean makeDefault = request.isDefault();

        if (makeDefault && !wasDefault) {
            unsetExistingDefault(user);
            address.setDefault(true);
        } else if (!makeDefault && wasDefault) {
            // Address was default but request wants to unset default
            // Find another address to make default if exists, or prevent unsetting if it's the only one
            address.setDefault(false);
            setAlternativeDefault(user, addressId);
        }

        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setStreetAddress(request.getStreetAddress());
        address.setApartment(request.getApartment());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());

        Address updated = addressRepository.save(address);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAddress(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        if (wasDefault) {
            setAlternativeDefault(user, addressId);
        }
    }

    @Transactional
    public AddressResponse setDefaultAddress(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.isDefault()) {
            unsetExistingDefault(user);
            address.setDefault(true);
            address = addressRepository.save(address);
        }

        return mapToResponse(address);
    }

    private void unsetExistingDefault(User user) {
        addressRepository.findByUserAndIsDefault(user, true)
                .ifPresent(addr -> {
                    addr.setDefault(false);
                    addressRepository.save(addr);
                });
    }

    private void setAlternativeDefault(User user, Long excludeAddressId) {
        List<Address> addresses = addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
        Optional<Address> alternative = addresses.stream()
                .filter(addr -> !addr.getId().equals(excludeAddressId))
                .findFirst();

        alternative.ifPresent(addr -> {
            addr.setDefault(true);
            addressRepository.save(addr);
        });
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phoneNumber(address.getPhoneNumber())
                .streetAddress(address.getStreetAddress())
                .apartment(address.getApartment())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .isDefault(address.isDefault())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}
