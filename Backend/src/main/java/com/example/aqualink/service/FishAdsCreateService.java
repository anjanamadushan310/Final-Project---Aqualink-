package com.example.aqualink.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.aqualink.dto.FishAdsRequestDTO;
import com.example.aqualink.entity.Fish;
import com.example.aqualink.entity.UserProfile;
import com.example.aqualink.repository.FishRepository;
import com.example.aqualink.repository.UserProfileRepository;

@Service
public class FishAdsCreateService {

    private final FishRepository fishRepository;
    private final FishImgUploadService fishImgUploadService;
    private final UserProfileRepository userProfileRepository; // Add this

    public FishAdsCreateService(FishRepository fishRepository, 
                               FishImgUploadService fishImgUploadService,
                               UserProfileRepository userProfileRepository) { // Add this parameter
        this.fishRepository = fishRepository;
        this.fishImgUploadService = fishImgUploadService;
        this.userProfileRepository = userProfileRepository; // Add this
    }

    @Transactional
    public Fish saveFishAd(FishAdsRequestDTO fishAdsRequestDTO) throws IOException {
        // Find user profile first using user email
        UserProfile userProfile = userProfileRepository.findByUserEmail(fishAdsRequestDTO.getUserEmail())
            .orElseThrow(() -> new RuntimeException("User profile not found for email: " + fishAdsRequestDTO.getUserEmail()));

        // Create Fish entity
        Fish fish = new Fish();
        fish.setName(fishAdsRequestDTO.getName());
        fish.setDescription(fishAdsRequestDTO.getDescription());
        fish.setNicNumber(fishAdsRequestDTO.getNicNumber());
        fish.setStock(fishAdsRequestDTO.getStock());
        fish.setPrice(fishAdsRequestDTO.getPrice());
        fish.setMinimumQuantity(fishAdsRequestDTO.getMinimumQuantity());
        
        // Set user profile relationship (මෙන්න town access වෙන්නේ)
        fish.setUserProfile(userProfile);

        // Save fish to get the ID
        Fish savedFish = fishRepository.save(fish);

        // Save images and get paths if provided
        if (fishAdsRequestDTO.getImages() != null && fishAdsRequestDTO.getImages().length > 0) {
            List<String> imagePaths = fishImgUploadService.saveImages(fishAdsRequestDTO.getImages(), savedFish.getId());
            savedFish.setImagePaths(imagePaths);

            // Save again to update with image paths
            savedFish = fishRepository.save(savedFish);
        }

        return savedFish;
    }
}
