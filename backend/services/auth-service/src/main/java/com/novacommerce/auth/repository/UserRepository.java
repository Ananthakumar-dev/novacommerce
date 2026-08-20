package com.novacommerce.auth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.novacommerce.auth.entity.User;
import com.novacommerce.auth.enums.Role;

public interface UserRepository extends JpaRepository<User, Long> {
    // find by user email
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    boolean existsByEmail(String email);

    boolean existsByRole(Role role);
}
