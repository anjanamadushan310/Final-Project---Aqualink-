package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "delivery_quotes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryQuote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quote_request_id", nullable = false)
    private DeliveryQuoteRequest quoteRequest;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_person_id", nullable = false)
    private User deliveryPerson;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryFee;
    
    @Column(nullable = false)
    private LocalDate deliveryDate;
    
    @Column(length = 500)
    private String notes;
   
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status = QuoteStatus.PENDING;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
    
    @Column(name = "valid_until", nullable = false)
    private LocalDateTime validUntil;
    
    public enum QuoteStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        EXPIRED
    }
}