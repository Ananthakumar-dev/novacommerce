package com.novacommerce.product.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.novacommerce.product.exception.InvalidMediaUploadException;

@Service
public class MediaStorageService {

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/svg+xml");

    private final Path uploadDirectory = Path.of("uploads").toAbsolutePath().normalize();

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidMediaUploadException("Image file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidMediaUploadException("Image must be 2 MB or smaller");
        }

        var contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new InvalidMediaUploadException("Only JPG, PNG, WebP, and SVG images are allowed");
        }

        try {
            Files.createDirectories(uploadDirectory);
            var extension = extensionFor(contentType);
            var filename = UUID.randomUUID() + extension;
            var target = uploadDirectory.resolve(filename).normalize();

            if (!target.startsWith(uploadDirectory)) {
                throw new InvalidMediaUploadException("Invalid image file name");
            }

            file.transferTo(target);
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new InvalidMediaUploadException("Unable to store image");
        }
    }

    public Path uploadDirectory() {
        return uploadDirectory;
    }

    private String extensionFor(String contentType) {
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/svg+xml" -> ".svg";
            default -> "";
        };
    }
}
