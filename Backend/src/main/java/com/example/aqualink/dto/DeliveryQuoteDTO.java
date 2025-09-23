package com.example.aqualink.dto;

import com.example.aqualink.entity.DeliveryQuote;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryQuoteDTO {
    
    private Long id;
    private Long quoteRequestId;
    private Long deliveryPersonId;
    private String deliveryPersonName;
    private String deliveryPersonEmail;
    private String deliveryPersonPhone;
    private BigDecimal deliveryFee;
    private LocalDate deliveryDate;
    private String notes;
    private DeliveryQuote.QuoteStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime validUntil;
}