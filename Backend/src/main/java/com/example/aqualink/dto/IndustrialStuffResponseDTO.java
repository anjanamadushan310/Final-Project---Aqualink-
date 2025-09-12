package com.example.aqualink.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class IndustrialStuffResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String district;
    private Integer stock;
    private Double price;
    private Boolean inStock;
    private Integer soldCount;
    private List<String> imageUrls;
    private LocalDateTime createDateAndTime;
    private String activeStatus;
    private Long userId;
    private Double rating;
    private Long totalSold;
    private Long reviewCount;
}
