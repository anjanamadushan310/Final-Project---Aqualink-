package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Base price (from price)

    @Column(precision = 10, scale = 2)
    private BigDecimal maxPrice; // For price range

    private String imageUrl;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(nullable = false)
    private Double reviewRate = 0.0;

    @Column(nullable = false)
    private Integer reviewCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(nullable = false)
    private Long serviceProviderId; // Seller/Service provider ID

    private String duration; // Service duration

    private String location; // Service location/area

    @Column(columnDefinition = "TEXT")
    private String requirements; // What customer needs to provide

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime approvedAt;

    private String rejectionReason;

    private Long approvedBy; // Admin ID who approved

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceBooking> bookings;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceReview> reviews;

    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
