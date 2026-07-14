package com.novacommerce.product.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.novacommerce.product.dto.MediaUploadResponse;
import com.novacommerce.product.service.MediaStorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/uploads")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminMediaController {

    private final MediaStorageService mediaStorageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaUploadResponse upload(@RequestParam("file") MultipartFile file) {
        return new MediaUploadResponse(mediaStorageService.store(file));
    }
}
