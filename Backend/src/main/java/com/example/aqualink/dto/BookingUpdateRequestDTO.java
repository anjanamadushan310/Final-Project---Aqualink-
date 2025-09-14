package com.example.aqualink.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingUpdateRequestDTO {

    @NotNull(message = "Status is required")
    private String status; // CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

    private BigDecimal quotedPrice;

    private String providerNotes;
}
