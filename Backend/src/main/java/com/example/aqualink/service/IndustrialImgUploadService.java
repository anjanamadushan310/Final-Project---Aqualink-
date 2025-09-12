package com.example.aqualink.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class IndustrialImgUploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${industrialimages.upload.dir}")
    private String industrialImagesUploadDir;

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            throw new IOException("Invalid file type. Only JPEG, JPG, and PNG files are allowed.");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFilename;
    }

    private boolean isValidImageType(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/jpg") ||
                        contentType.equals("image/png")
        );
    }

    public void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Error deleting file: " + e.getMessage());
        }
    }

    public List<String> saveImages(MultipartFile[] images, Long industrialId) throws IOException {
        List<String> savedImagePaths = new ArrayList<>();
        if (images == null || images.length == 0) {
            return savedImagePaths;
        }

        // Validate file types first
        for (MultipartFile image : images) {
            if (!image.isEmpty() && !isValidImageType(image.getContentType())) {
                throw new IOException("Invalid file type. Only JPEG, JPG, and PNG files are allowed.");
            }
        }

        // Create directory structure: uploads/industrial_images/{industrialId}/
        Path industrialImagesDir = Paths.get(industrialImagesUploadDir, industrialId.toString()).toAbsolutePath();

        // Create directories if they don't exist
        Files.createDirectories(industrialImagesDir);

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                // Generate unique filename
                String originalFilename = image.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }

                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                Path targetPath = industrialImagesDir.resolve(uniqueFilename);

                // Save the file
                Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

                // Store the URL path that matches the frontend expectation
                String urlPath = "/uploads/industrial_images/" + industrialId + "/" + uniqueFilename;
                savedImagePaths.add(urlPath);
            }
        }

        return savedImagePaths;
    }

    public void deleteImages(List<String> imagePaths) {
        for (String imagePath : imagePaths) {
            try {
                // Extract the relative path and construct full path
                String relativePath = imagePath.replace("/uploads/industrial_images/", "");
                Path fullPath = Paths.get(industrialImagesUploadDir, relativePath);
                Files.deleteIfExists(fullPath);
            } catch (IOException e) {
                System.err.println("Failed to delete image: " + imagePath + " - " + e.getMessage());
            }
        }
    }
}
