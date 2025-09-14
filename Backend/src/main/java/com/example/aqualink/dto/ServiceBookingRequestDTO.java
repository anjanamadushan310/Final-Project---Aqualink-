package com.example.aqualink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceBookingRequestDTO {
    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotBlank(message = "Customer requirements are required")
    private String customerRequirements;

    @NotNull(message = "Preferred date is required")
    private String preferredDate; // Will be converted to LocalDateTime

    private String preferredTime;

    @NotBlank(message = "Customer location is required")
    private String customerLocation;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;
}
