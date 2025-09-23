package com.example.aqualink.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPersonDTO {
    private String nicNumber;
    private String name;
    private String phoneNumber;
    private String email;
    private boolean active;
    private Integer totalDeliveries;
    private Integer pendingDeliveries;
    private Integer completedDeliveries;
}