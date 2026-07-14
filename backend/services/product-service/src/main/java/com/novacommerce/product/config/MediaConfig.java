package com.novacommerce.product.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.novacommerce.product.service.MediaStorageService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class MediaConfig implements WebMvcConfigurer {

    private final MediaStorageService mediaStorageService;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(mediaStorageService.uploadDirectory().toUri().toString());
    }
}
