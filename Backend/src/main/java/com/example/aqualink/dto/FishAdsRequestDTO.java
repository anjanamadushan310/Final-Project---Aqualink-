package com.example.aqualink.dto;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class FishAdsRequestDTO {

    private String name;
    private String description;
    private String nicNumber;
    private Integer stock;
    private Double price;
    private Integer minimumQuantity;
    private Long userId;

    private MultipartFile[] images;

}
