package com.example.aqualink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverageAreaDTO {
    private List<String> selectedDistricts;
    private Map<String, List<String>> selectedTowns;
}