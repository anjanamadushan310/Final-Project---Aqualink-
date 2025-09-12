package com.example.aqualink.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class BookingUpdateRequestDTO {

    @NotNull(message = "Status is required")
    private String status; // CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

    private BigDecimal quotedPrice;

    private String providerNotes;
}
