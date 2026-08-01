package com.novacommerce.order_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.novacommerce.order_service.entity.ShippingMethod;

@Repository
public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, Long> {
    List<ShippingMethod> findByIsActiveTrue();
}
