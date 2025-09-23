package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "delivery_person_coverage")
public class DeliveryPersonCoverage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_person_user_id", nullable = false)
    private User deliveryPersonUser;

    @Column(name = "towns", columnDefinition = "TEXT")
    private String townsData;

    // Helper methods to handle List<String> conversion
    @Transient
    public List<String> getTowns() {
        if (townsData == null || townsData.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(townsData.split(",")));
    }

    @Transient
    public void setTowns(List<String> towns) {
        if (towns == null || towns.isEmpty()) {
            this.townsData = "";
        } else {
            this.townsData = String.join(",", towns);
        }
    }
}