package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAssignmentDTO {
    
    private Long orderId;
    private String deliveryPersonNic;
    private LocalDate assignedDate;
    private String assignedBy;
}