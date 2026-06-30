package com.novacommerce.auth.dto;

import com.novacommerce.auth.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String fullName;

    @NotNull
    private Role role;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
