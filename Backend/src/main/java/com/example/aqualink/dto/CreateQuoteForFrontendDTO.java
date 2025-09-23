package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuoteForFrontendDTO {
    
    private Long requestId;
    private BigDecimal deliveryFee;
    private LocalDate deliveryDate;
    private String notes;
    private int validityHours; // How many hours the quote is valid
}