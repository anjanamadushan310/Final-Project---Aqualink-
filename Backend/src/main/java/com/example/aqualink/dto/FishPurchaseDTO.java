package com.example.aqualink.dto;

import lombok.Data;

@Data
public class FishPurchaseDTO {
    private Long fishId;
    private Integer quantity;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String deliveryAddress;
}

