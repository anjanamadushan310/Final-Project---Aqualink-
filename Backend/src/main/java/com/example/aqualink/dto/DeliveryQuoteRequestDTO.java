package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryQuoteRequestDTO {
    
    private Long id;
    private Long orderId;
    private String sessionId;
    private LocalDateTime lastRespondingDateTime;
    private LocalDateTime createTime;
    private String pickupAddress;
    private String deliveryAddress;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}