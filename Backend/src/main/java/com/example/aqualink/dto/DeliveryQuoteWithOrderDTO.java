package com.example.aqualink.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.aqualink.entity.DeliveryQuote;
import com.example.aqualink.entity.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryQuoteWithOrderDTO {
    private Long id;  // quote id
    private BigDecimal deliveryFee;
    private LocalDateTime deliveryDate;
    private DeliveryQuote.QuoteStatus status;
    private Long orderId;
    private Order.OrderStatus orderStatus;
    private BigDecimal totalAmount;
}