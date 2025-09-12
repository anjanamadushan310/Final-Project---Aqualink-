package com.example.aqualink.dto;

import lombok.Data;

@Data
public class IndustrialStuffPurchaseDTO {
    private Long industrialId;
    private Integer quantity = 1;
    private Long userId;
}
