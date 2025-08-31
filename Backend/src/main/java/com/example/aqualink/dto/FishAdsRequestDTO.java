package com.example.aqualink.dto;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FishAdsRequestDTO {

    private String name;
    private String description;
    private String nicNumber;
    private Integer stock;
    private Double price;
    private Integer minimumQuantity;

    private MultipartFile[] images;

}
