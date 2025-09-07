package com.example.aqualink.dto;

import java.time.LocalDateTime;

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
    private String imageUrl;
    private LocalDateTime createDateAndTime;
    private String activeStatus;
    private String userEmail;

    public String getDistrict() {
    return district;
    }

    public void setDistrict(String district) {
    this.district = district;
    }


    public void setUserEmail(String userEmail) {
    this.userEmail = userEmail;
}
}

