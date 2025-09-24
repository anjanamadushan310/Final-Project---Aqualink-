package com.example.aqualink.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.blog-images:blog-images}")
    private String blogImagesSubDir;

    public String storeFile(MultipartFile file, String category) throws IOException {
        // Create directories if they don't exist
        Path uploadPath = Paths.get(uploadDir, category);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Store the file
        Path targetLocation = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Return the relative path for database storage
        return category + "/" + uniqueFilename;
    }

    public String storeBlogImage(MultipartFile file) throws IOException {
        return storeFile(file, blogImagesSubDir);
    }

    public void deleteFile(String filePath) throws IOException {
        if (filePath != null && !filePath.isEmpty()) {
            Path fileToDelete = Paths.get(uploadDir, filePath);
            if (Files.exists(fileToDelete)) {
                Files.delete(fileToDelete);
            }
        }
    }

    public byte[] loadFileAsBytes(String filePath) throws IOException {
        Path file = Paths.get(uploadDir, filePath);
        if (Files.exists(file)) {
            return Files.readAllBytes(file);
        }
        throw new IOException("File not found: " + filePath);
    }

    public Path loadFileAsPath(String filePath) throws IOException {
        Path file = Paths.get(uploadDir, filePath);
        if (Files.exists(file)) {
            return file;
        }
        throw new IOException("File not found: " + filePath);
    }

    public boolean fileExists(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        Path file = Paths.get(uploadDir, filePath);
        return Files.exists(file);
    }

    public String getFileUrl(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }
        return "/api/files/" + filePath;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    public boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    public void validateImageFile(MultipartFile file) throws IllegalArgumentException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (!isImageFile(file)) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Check file size (5MB limit)
        long maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size cannot exceed 5MB");
        }

        // Check for valid extensions
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = getFileExtension(originalFilename).toLowerCase();
            if (!extension.matches("\\.(jpg|jpeg|png|gif|webp)")) {
                throw new IllegalArgumentException("Only JPG, JPEG, PNG, GIF, and WebP files are allowed");
            }
        }
    }
}