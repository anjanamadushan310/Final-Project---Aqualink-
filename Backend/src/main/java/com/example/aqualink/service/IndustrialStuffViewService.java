package com.example.aqualink.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.aqualink.dto.IndustrialStuffPurchaseDTO;
import com.example.aqualink.dto.IndustrialStuffResponseDTO;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.entity.IndustrialStuff;
import com.example.aqualink.repository.IndustrialStuffRepository;
import com.example.aqualink.repository.OrderItemRepository;
import com.example.aqualink.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IndustrialStuffViewService {

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    private final IndustrialStuffRepository industrialStuffRepository;
    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;

    public List<IndustrialStuffResponseDTO> getAllAvailableIndustrial() {
        List<IndustrialStuff> industrialList = industrialStuffRepository.findAvailableIndustrialWithProfile();
        return industrialList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<IndustrialStuffResponseDTO> getIndustrialById(Long id) {
        return industrialStuffRepository.findByIdWithProfile(id)
                .map(this::convertToDTO);
    }

    public List<IndustrialStuffResponseDTO> searchIndustrial(String query) {
        List<IndustrialStuff> industrialList = industrialStuffRepository.findByNameContainingIgnoreCase(query);
        return industrialList.stream()
                .filter(industrial -> industrial.getActiveStatus() == ActiveStatus.VERIFIED &&
                        industrial.getStock() > 0 &&
                        industrial.getInStock())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean processPurchase(IndustrialStuffPurchaseDTO purchaseDTO) {
        Optional<IndustrialStuff> industrialOpt = industrialStuffRepository.findById(purchaseDTO.getIndustrialId());
        if (industrialOpt.isPresent()) {
            IndustrialStuff industrial = industrialOpt.get();
            if (industrial.getStock() >= purchaseDTO.getQuantity() &&
                    industrial.getActiveStatus() == ActiveStatus.VERIFIED &&
                    industrial.getInStock()) {

                industrial.setStock(industrial.getStock() - purchaseDTO.getQuantity());
                industrial.setSoldCount(industrial.getSoldCount() + purchaseDTO.getQuantity());

                // Update stock status if needed
                if (industrial.getStock() <= 0) {
                    industrial.setInStock(false);
                }

                industrialStuffRepository.save(industrial);
                return true;
            }
        }
        return false;
    }

    private IndustrialStuffResponseDTO convertToDTO(IndustrialStuff industrial) {
        IndustrialStuffResponseDTO dto = new IndustrialStuffResponseDTO();
        dto.setId(industrial.getId());
        dto.setName(industrial.getName());
        dto.setDescription(industrial.getDescription());
        dto.setCategory(industrial.getCategory());
        dto.setStock(industrial.getStock());
        dto.setPrice(industrial.getPrice());
        dto.setInStock(industrial.getInStock());
        dto.setSoldCount(industrial.getSoldCount());
        dto.setCreateDateAndTime(industrial.getCreateDateAndTime());
        dto.setActiveStatus(industrial.getActiveStatus().toString());

        // Get district and userId from user profile
        if (industrial.getUser() != null && industrial.getUser().getUserProfile() != null) {
            dto.setDistrict(industrial.getUser().getUserProfile().getAddressDistrict());
            dto.setUserId(industrial.getUser().getId());
        }

        // Get images
        if (industrial.getImagePaths() != null && !industrial.getImagePaths().isEmpty()) {
            List<String> fullImageUrls = industrial.getImagePaths().stream()
                .map(path -> baseUrl + path)
                .collect(Collectors.toList());
            dto.setImageUrls(fullImageUrls);
        } else {
            dto.setImageUrls(List.of("/images/default-industrial.jpg"));
        }

        // Calculate rating
        Double averageRating = reviewRepository.findAverageRatingByProductId(industrial.getId());
        dto.setRating(averageRating != null ? averageRating : 0.0);

        // Calculate total sold
        Long totalSold = orderItemRepository.findTotalSoldByProductId(industrial.getId());
        dto.setTotalSold(totalSold != null ? totalSold : Long.valueOf(industrial.getSoldCount()));

        // Calculate review count
        Long reviewCount = reviewRepository.countReviewsByProductId(industrial.getId());
        dto.setReviewCount(reviewCount != null ? reviewCount : 0L);

        return dto;
    }
}
