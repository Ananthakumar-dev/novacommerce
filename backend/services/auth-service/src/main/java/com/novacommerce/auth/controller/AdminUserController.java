package com.novacommerce.auth.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.novacommerce.auth.dto.AuthResponse;
import com.novacommerce.auth.dto.RegisterRequest;
import com.novacommerce.auth.dto.UpdateUserRequest;
import com.novacommerce.auth.dto.UserProfileResponse;
import com.novacommerce.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final AuthService authService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse createUser(@Valid @RequestBody RegisterRequest request) {
        return authService.createAdminManagedUser(request);
    }

    @GetMapping
    public List<UserProfileResponse> listUsers() {
        return authService.listUsers();
    }

    @GetMapping("/{id}")
    public UserProfileResponse getUser(@PathVariable Long id) {
        return authService.getUser(id);
    }

    @PutMapping("/{id}")
    public UserProfileResponse updateUser(@PathVariable Long id,
                                          @Valid @RequestBody UpdateUserRequest request) {
        return authService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
    }
}
