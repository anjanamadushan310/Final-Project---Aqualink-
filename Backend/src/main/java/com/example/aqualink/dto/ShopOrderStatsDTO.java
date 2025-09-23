package com.example.aqualink.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopOrderStatsDTO {
    private long totalOrders;
    private long pendingOrders;
    private long shippedOrders;
    private long completedOrders;
    private long cancelledOrders;
    private double totalRevenue;
}