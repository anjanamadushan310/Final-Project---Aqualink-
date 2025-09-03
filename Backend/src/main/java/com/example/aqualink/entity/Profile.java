package com.example.aqualink.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @Column(name = "nic_number", unique = true)
    private String nicNumber;

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "business_type")
    private String businessType;

    @Column(name = "place")
    private String place;

    @Column(name = "street")
    private String street;

    @Column(name = "town")
    private String town;

    @Column(name = "district")
    private String district;

    @Column(name = "business_logo_url")
    private String businessLogoUrl;

    @OneToOne
    private User user;
}
