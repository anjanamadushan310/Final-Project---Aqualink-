package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleCurrentDeliveryDTO {
    private Long orderId;
    private String customerName;
    private String customerPhone;
    private String address;
    private String status;
    private BigDecimal totalAmount;
    private BigDecimal deliveryFee;
    private LocalDate orderDate;
    private LocalDate deliveryStartDate;
}