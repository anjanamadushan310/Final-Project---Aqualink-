package com.example.aqualink.service;

import com.example.aqualink.dto.FishAdsResponseDTO;
import com.example.aqualink.dto.FishPurchaseDTO;
import com.example.aqualink.entity.Fish;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.repository.FishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FishAdsViewService {

    private final FishRepository fishRepository;

    public List<FishAdsResponseDTO> getAllAvailableFish() {
        List<Fish> fishList = fishRepository.findAvailableFish();
        return fishList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<FishAdsResponseDTO> getFishById(Long id) {
        return fishRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<FishAdsResponseDTO> searchFish(String query) {
        List<Fish> fishList = fishRepository.findByNameContainingIgnoreCase(query);
        return fishList.stream()
                .filter(fish -> fish.getActiveStatus() == ActiveStatus.VERIFIED && fish.getStock() > 0)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean processPurchase(FishPurchaseDTO purchaseDTO) {
        Optional<Fish> fishOpt = fishRepository.findById(purchaseDTO.getFishId());

        if (fishOpt.isPresent()) {
            Fish fish = fishOpt.get();

            // Check if enough stock available
            if (fish.getStock() >= purchaseDTO.getQuantity() &&
                    purchaseDTO.getQuantity() >= fish.getMinimumQuantity()) {

                // Update stock
                fish.setStock(fish.getStock() - purchaseDTO.getQuantity());
                fishRepository.save(fish);

                // Here you can add order creation logic
                // createOrder(purchaseDTO, fish);

                return true;
            }
        }
        return false;
    }

    private FishAdsResponseDTO convertToDTO(Fish fish) {
        FishAdsResponseDTO dto = new FishAdsResponseDTO();
        dto.setId(fish.getId());
        dto.setName(fish.getName());
        dto.setDescription(fish.getDescription());
        dto.setStock(fish.getStock());
        dto.setPrice(fish.getPrice());
        dto.setMinimumQuantity(fish.getMinimumQuantity());
        dto.setCreateDateAndTime(fish.getCreateDateAndTime());
        dto.setActiveStatus(fish.getActiveStatus().toString());

        // Get first image if available
        if (fish.getImagePaths() != null && !fish.getImagePaths().isEmpty()) {
            dto.setImageUrl(fish.getImagePaths().get(0));
        }

        return dto;
    }
}

