package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private String productName;
    private String productType; // "fish" or "industrial"
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
    private String imageUrl;
    private String description;
}