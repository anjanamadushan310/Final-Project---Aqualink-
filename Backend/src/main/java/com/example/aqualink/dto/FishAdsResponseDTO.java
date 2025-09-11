package com.example.aqualink.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class FishAdsResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String district;  // Add this field
    private Integer stock;
    private Double price;
    private Integer minimumQuantity;
    private List<String> imageUrls;
    private LocalDateTime createDateAndTime;
    private String activeStatus;
    private Long userId;
    private Double rating;
    private Long totalSold;
    private Long reviewCount;

    public String getDistrict() {
    return district;
    }

    public void setDistrict(String district) {
    this.district = district;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
}
}

