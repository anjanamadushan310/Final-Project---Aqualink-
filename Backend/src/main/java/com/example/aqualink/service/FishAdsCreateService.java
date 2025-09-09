package com.example.aqualink.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.aqualink.dto.FishAdsRequestDTO;
import com.example.aqualink.entity.Fish;
import com.example.aqualink.entity.User;
import com.example.aqualink.repository.FishRepository;
import com.example.aqualink.repository.UserRepository;

@Service
public class FishAdsCreateService {

    private final FishRepository fishRepository;
    private final FishImgUploadService fishImgUploadService;
    private final UserRepository userRepository; // Changed to UserRepository

    public FishAdsCreateService(FishRepository fishRepository, 
                               FishImgUploadService fishImgUploadService,
                               UserRepository userRepository) { // Changed parameter
        this.fishRepository = fishRepository;
        this.fishImgUploadService = fishImgUploadService;
        this.userRepository = userRepository; // Changed assignment
    }

    @Transactional
    public Fish saveFishAd(FishAdsRequestDTO fishAdsRequestDTO) throws IOException {
        // Find user using userId
        User user = userRepository.findById(fishAdsRequestDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found for userId: " + fishAdsRequestDTO.getUserId()));

        // Create Fish entity
        Fish fish = new Fish();
        fish.setName(fishAdsRequestDTO.getName());
        fish.setDescription(fishAdsRequestDTO.getDescription());
        fish.setNicNumber(fishAdsRequestDTO.getNicNumber());
        fish.setStock(fishAdsRequestDTO.getStock());
        fish.setPrice(fishAdsRequestDTO.getPrice());
        fish.setMinimumQuantity(fishAdsRequestDTO.getMinimumQuantity());

        // Set user relationship (changed from userProfile to user)
        fish.setUser(user);

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