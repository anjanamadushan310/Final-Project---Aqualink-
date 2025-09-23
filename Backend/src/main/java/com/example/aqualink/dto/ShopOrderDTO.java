package com.example.aqualink.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopOrderDTO {
    private Long orderId;
    private String customerNicNumber;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private LocalDate orderDate;
    private String shippingAddress;
    private String orderStatus;
    private BigDecimal totalAmount;
    private BigDecimal deliveryFee;
    private String deliveryGuyNicNumber;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private String deliveryRequiredStatus;
    private LocalDate deliveryStartDate;
    private List<ShopOrderItemDTO> orderItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShopOrderItemDTO {
        private Long orderItemId;
        private String productName;
        private String productType;
        private Integer quantity;
        private BigDecimal price;
        private String productImage;
        private boolean isMyProduct; // true if this shop owner sells this product
    }
}