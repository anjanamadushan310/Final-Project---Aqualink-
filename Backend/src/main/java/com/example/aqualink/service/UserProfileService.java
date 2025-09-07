package com.example.aqualink.service;

import com.example.aqualink.entity.UserProfile;
import com.example.aqualink.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public UserProfile getProfileByEmail(String email) {
        return userProfileRepository.findByUserEmail(email).orElse(null);
    }

    public UserProfile updateProfile(UserProfile profileData, MultipartFile logoFile) {
        try {
            // Find existing profile or create new one
            UserProfile existingProfile = userProfileRepository.findByUserEmail(profileData.getUserEmail())
                    .orElse(new UserProfile());

            // Update fields
            existingProfile.setUserEmail(profileData.getUserEmail());
            existingProfile.setBusinessName(profileData.getBusinessName());
            existingProfile.setBusinessType(profileData.getBusinessType());
            existingProfile.setAddressPlace(profileData.getAddressPlace());
            existingProfile.setAddressStreet(profileData.getAddressStreet());
            existingProfile.setAddressDistrict(profileData.getAddressDistrict());
            existingProfile.setAddressTown(profileData.getAddressTown());

            // Handle logo file upload
            if (logoFile != null && !logoFile.isEmpty()) {
                String logoPath = saveLogoFile(logoFile);
                existingProfile.setLogoPath(logoPath);
                existingProfile.setLogoName(logoFile.getOriginalFilename());
                existingProfile.setLogoType(logoFile.getContentType());
            }

            // Set timestamps
            if (existingProfile.getId() == null) {
                existingProfile.setCreatedAt(LocalDateTime.now());
            }
            existingProfile.setUpdatedAt(LocalDateTime.now());

            return userProfileRepository.save(existingProfile);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile: " + e.getMessage(), e);
        }
    }

    private String saveLogoFile(MultipartFile file) throws IOException {
        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, "logos");
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

        return filePath.toString();
    }
}
