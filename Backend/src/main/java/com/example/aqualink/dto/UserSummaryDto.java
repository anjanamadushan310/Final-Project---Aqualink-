package com.example.aqualink.dto;

import lombok.Data;

@Data
public class UserSummaryDto {
    private Long id;
    private String name;
    private String email;
    private String logoUrl; // Profile picture URL
}