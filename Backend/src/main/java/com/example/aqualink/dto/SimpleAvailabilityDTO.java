package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleAvailabilityDTO {
    private Boolean available;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDateTime lastUpdated;
}