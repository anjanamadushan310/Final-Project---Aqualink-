package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(name = "nic_number")
    private String nicNumber;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "order_status")
    private String orderStatus; // pending, shipped, delivered, canceled

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "delivery_fee")
    private BigDecimal deliveryFee;

    @Column(name = "delivery_guy_nic_number")
    private String deliveryGuyNicNumber;

    @Column(name = "delivery_required_status")
    private String deliveryRequiredStatus; // verified, not yet

    @Column(name = "delivery_start_date")
    private LocalDate deliveryStartDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
}
