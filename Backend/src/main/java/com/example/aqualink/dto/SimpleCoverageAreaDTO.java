package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleCoverageAreaDTO {
    private Long id;
    private String district;
    private String town;
    private Boolean active;
}