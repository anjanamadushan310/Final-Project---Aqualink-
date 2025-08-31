//package com.example.aqualink.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Entity
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Table(name = "fish_ads")
//public class Fish {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String name;
//    private String description;
//    private String role;
//    private String nicNumber;
//    private Integer stock;
//    private Double price;
//    private Integer minimumQuantity;
//
//    @Column(name = "create_date_and_time")
//    private LocalDateTime createDateAndTime;
//
//    @Enumerated(EnumType.STRING)
//    private ActiveStatus activeStatus = ActiveStatus.PENDING;
//
//    // Add this field to store image paths
//    @ElementCollection
//    @CollectionTable(name = "fish_images", joinColumns = @JoinColumn(name = "fish_id"))
//    @Column(name = "image_path")
//    private List<String> imagePaths;
//
//    @PrePersist
//    protected void onCreate() {
//        createDateAndTime = LocalDateTime.now();
//    }
//}
package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "fish_ads")
public class Fish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String nicNumber;
    private Integer stock;
    private Double price;
    private Integer minimumQuantity;

    @Column(name = "create_date_and_time")
    private LocalDateTime createDateAndTime;

    @Enumerated(EnumType.STRING)
    private ActiveStatus activeStatus = ActiveStatus.PENDING;

    // Add this field to store image paths
    @ElementCollection
    @CollectionTable(name = "fish_images", joinColumns = @JoinColumn(name = "fish_id"))
    @Column(name = "image_path")
    private List<String> imagePaths;

    @PrePersist
    protected void onCreate() {
        createDateAndTime = LocalDateTime.now();
    }
}
