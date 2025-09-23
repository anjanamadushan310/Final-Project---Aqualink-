package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequestForFrontendDTO {
    
    private Long requestId;
    private String sessionId;
    private Long orderId;
    private String pickupAddress;
    private String deliveryAddress;
    private String customerName;
    private String customerPhone;
    private LocalDateTime deadline;
    private LocalDateTime createTime;
    private String orderDetails;
}