package com.novacommerce.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.novacommerce.auth.dto.AuthRequest;
import com.novacommerce.auth.dto.AuthResponse;
import com.novacommerce.auth.dto.RegisterRequest;
import com.novacommerce.auth.dto.UpdateUserRequest;
import com.novacommerce.auth.dto.UserProfileResponse;
import com.novacommerce.auth.entity.User;
import com.novacommerce.auth.enums.Role;
import com.novacommerce.auth.exception.BootstrapUnavailableException;
import com.novacommerce.auth.exception.DuplicateEmailException;
import com.novacommerce.auth.exception.InvalidRoleException;
import com.novacommerce.auth.repository.UserRepository;
import com.novacommerce.auth.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new InvalidRoleException("Public registration cannot create ADMIN users");
        }
        return createUser(request);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("Authenticated user was not found"));
        return toAuthResponse(user);
    }

    @Transactional
    public AuthResponse createAdminManagedUser(RegisterRequest request) {
        return createUser(request);
    }

    public List<UserProfileResponse> listUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toProfileResponse)
                .toList();
    }

    public UserProfileResponse getUser(Long id) {
        return userRepository.findById(id)
                .map(this::toProfileResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User was not found"));
    }

    @Transactional
    public UserProfileResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User was not found"));

        userRepository.findByEmail(request.getEmail())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateEmailException("A user with this email already exists");
                });

        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toProfileResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User was not found");
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public AuthResponse bootstrapAdmin(RegisterRequest request) {
        if (userRepository.existsByRole(Role.ADMIN)) {
            throw new BootstrapUnavailableException("Admin bootstrap is unavailable after an ADMIN exists");
        }
        request.setRole(Role.ADMIN);
        return createUser(request);
    }

    public UserProfileResponse profile(User user) {
        return toProfileResponse(user);
    }

    private AuthResponse createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("A user with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .build();

        return toAuthResponse(userRepository.save(user));
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtUtil.generateToken(user, user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getEmail(), user.getFullName());
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
