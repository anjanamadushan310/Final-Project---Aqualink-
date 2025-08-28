package com.example.aqualink.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.aqualink.entity.Banner;
import com.example.aqualink.repository.BannerRepository;

@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerRepository bannerRepo;

    // Use the same directory as configured in application.properties
    @Value("${file.upload-dir:./uploads/}")
    private String baseUploadDir;
    
    private final String BANNER_SUBDIR = "banners/";

    @Override
    public List<Banner> getAllBanners() {
        return bannerRepo.findAll();
    }

    @Override
    public Banner addBanner(Banner banner) {
        return bannerRepo.save(banner);
    }

    @Override
    public Banner uploadBanner(MultipartFile file) {
        try {
            // Create full upload path
            String fullUploadDir = baseUploadDir + BANNER_SUBDIR;
            Path uploadPath = Paths.get(fullUploadDir);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);

            // Create banner entity with correct URL path
            Banner banner = new Banner();
            banner.setImageUrl("/uploads/banners/" + uniqueFileName);

            return bannerRepo.save(banner);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload banner image: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteBanner(Long id) {
        // Optional: Delete the actual file from disk before deleting from database
        try {
            Banner banner = bannerRepo.findById(id).orElse(null);
            if (banner != null) {
                String imageUrl = banner.getImageUrl();
                if (imageUrl != null && imageUrl.startsWith("/uploads/banners/")) {
                    String fileName = imageUrl.substring("/uploads/banners/".length());
                    Path filePath = Paths.get(baseUploadDir + BANNER_SUBDIR + fileName);
                    Files.deleteIfExists(filePath);
                }
            }
        } catch (IOException e) {
            System.err.println("Failed to delete banner file: " + e.getMessage());
        }
        
        bannerRepo.deleteById(id);
    }
}