package com.example.aqualink.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuoteForFrontendDTO {
    
    private Long requestId;
    private BigDecimal deliveryFee;
    private LocalDate deliveryDate;
    private String notes;
    private int validityHours; // How many hours the quote is valid
    private LocalDateTime expiresAt; // Alternative to validityHours - exact expiry time
}