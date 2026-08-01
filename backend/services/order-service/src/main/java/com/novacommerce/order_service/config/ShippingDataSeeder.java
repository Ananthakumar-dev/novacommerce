package com.novacommerce.order_service.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.novacommerce.order_service.entity.ShippingMethod;
import com.novacommerce.order_service.repository.ShippingMethodRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShippingDataSeeder implements CommandLineRunner {

    private final ShippingMethodRepository shippingMethodRepository;

    @Override
    public void run(String... args) throws Exception {
        if (shippingMethodRepository.count() == 0) {
            log.info("No shipping methods found. Seeding default configurations...");

            ShippingMethod standard = ShippingMethod.builder()
                    .name("Standard Ground")
                    .carrier("Local Courier")
                    .baseRate(new BigDecimal("150.00"))
                    .minOrderValueForFreeShipping(new BigDecimal("5000.00"))
                    .estimatedDeliveryDays(5)
                    .isActive(true)
                    .build();

            ShippingMethod express = ShippingMethod.builder()
                    .name("Express Saver")
                    .carrier("FedEx")
                    .baseRate(new BigDecimal("350.00"))
                    .minOrderValueForFreeShipping(null)
                    .estimatedDeliveryDays(2)
                    .isActive(true)
                    .build();

            shippingMethodRepository.saveAll(List.of(standard, express));
            log.info("Successfully seeded default shipping configurations.");
        } else {
            log.info("Shipping methods already exist in the database. Skipping seed.");
        }
    }
}
