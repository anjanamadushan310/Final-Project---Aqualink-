package com.example.aqualink.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FishAdsStatusDto {
    private String activeStatus; // "PENDING", "VERIFIED", or "REJECTED"
}

