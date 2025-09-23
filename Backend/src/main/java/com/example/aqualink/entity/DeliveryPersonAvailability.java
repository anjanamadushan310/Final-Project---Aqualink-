package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "delivery_person_availability")
public class DeliveryPersonAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_person_user_id", nullable = false)
    private User deliveryPersonUser;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @ElementCollection
    @CollectionTable(
        name = "delivery_person_service_towns", 
        joinColumns = @JoinColumn(name = "availability_id")
    )
    @Column(name = "town_name")
    private List<String> serviceTowns;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();
}