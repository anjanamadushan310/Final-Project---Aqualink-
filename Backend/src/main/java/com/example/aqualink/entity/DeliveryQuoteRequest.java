package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "delivery_quote_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryQuoteRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_id", nullable = false)
    private Long orderId;
    
    @Column(name = "last_responding_date_time")
    private LocalDateTime lastRespondingDateTime;
    
    @CreationTimestamp
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @OneToMany(mappedBy = "quoteRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DeliveryQuote> deliveryQuotes;
}