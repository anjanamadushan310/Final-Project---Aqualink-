package com.example.aqualink.service;

import com.example.aqualink.dto.FishAdsRequestDTO;
import com.example.aqualink.entity.Fish;
import com.example.aqualink.repository.FishRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
public class FishService {

    private final FishRepository fishRepository;
    private final FishImgUploadService fishImgUploadService;

    public FishService(FishRepository fishRepository, FishImgUploadService fishImgUploadService) {
        this.fishRepository = fishRepository;
        this.fishImgUploadService = fishImgUploadService;
    }

    @Transactional
    public Fish saveFishAd(FishAdsRequestDTO fishAdsRequestDTO) throws IOException {
        // Create Fish entity
        Fish fish = new Fish();
        fish.setName(fishAdsRequestDTO.getName());
        fish.setDescription(fishAdsRequestDTO.getDescription());
        fish.setNicNumber(fishAdsRequestDTO.getNicNumber());
        fish.setStock(fishAdsRequestDTO.getStock());
        fish.setPrice(fishAdsRequestDTO.getPrice());
        fish.setMinimumQuantity(fishAdsRequestDTO.getMinimumQuantity());

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
