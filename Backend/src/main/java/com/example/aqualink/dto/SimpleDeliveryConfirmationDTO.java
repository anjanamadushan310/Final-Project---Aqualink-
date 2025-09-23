package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleDeliveryConfirmationDTO {
    private Long orderId;
    private String status;
    private String message;
    private LocalDateTime confirmedAt;
}