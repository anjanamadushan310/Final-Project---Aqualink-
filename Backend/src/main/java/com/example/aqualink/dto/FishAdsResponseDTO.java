package com.example.aqualink.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FishAdsResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer stock;
    private Double price;
    private Integer minimumQuantity;
    private String imageUrl;
    private LocalDateTime createDateAndTime;
    private String activeStatus;
}

