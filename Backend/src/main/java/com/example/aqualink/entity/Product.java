package com.example.aqualink.entity;

import com.example.aqualink.entity.ActiveStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String image1;
    private String image2;
    private String image3;
    private String image4;
    private String image5;

    private Double price;
    private String town;
    private Integer stock;
    private String description;
    private String role;
    private String userId;
    private Integer howManyYearsOld;
    private Boolean verified = false;

    @Column(name = "create_date_and_time")
    private LocalDateTime createDateAndTime;

    @Enumerated(EnumType.STRING)
    private ActiveStatus activeStatus = ActiveStatus.INACTIVE;

    // Constructors, getters, and setters

    @PrePersist
    protected void onCreate() {
        createDateAndTime = LocalDateTime.now();
    }
}
