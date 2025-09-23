package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleEarningsDTO {
    private BigDecimal totalEarnings;
    private BigDecimal monthlyEarnings;
    private BigDecimal dailyEarnings;
    private Integer totalDeliveries;
    private Integer monthlyDeliveries;
}