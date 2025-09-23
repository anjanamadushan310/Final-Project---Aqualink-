package com.example.aqualink.controller;

import com.example.aqualink.dto.*;
import com.example.aqualink.entity.User;
import com.example.aqualink.entity.Order;
import com.example.aqualink.repository.UserRepository;
import com.example.aqualink.service.ShopOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ShopOwnerController {

    private final ShopOrderService shopOrderService;
    private final UserRepository userRepository;

    private String getCurrentUserNic(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(User::getNicNumber).orElseThrow(() -> 
            new RuntimeException("User not found for email: " + email));
    }

    /**
     * Get all orders containing products from the authenticated shop owner
     */
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getMyOrders(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        List<ShopOrderDTO> orders = shopOrderService.getOrdersForShopOwner(shopOwnerNic);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get pending orders for the authenticated shop owner
     */
    @GetMapping("/pending-orders")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getPendingOrders(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        List<ShopOrderDTO> orders = shopOrderService.getPendingOrdersForShopOwner(shopOwnerNic);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get completed orders for the authenticated shop owner
     */
    @GetMapping("/completed-orders")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getCompletedOrders(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        List<ShopOrderDTO> orders = shopOrderService.getCompletedOrdersForShopOwner(shopOwnerNic);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get orders in transit for the authenticated shop owner
     */
    @GetMapping("/in-transit-orders")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getInTransitOrders(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        List<ShopOrderDTO> orders = shopOrderService.getInTransitOrdersForShopOwner(shopOwnerNic);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get orders by status for the authenticated shop owner
     */
    @PostMapping("/orders/status")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getOrdersByStatus(
            @RequestBody List<String> statuses,
            Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        
        // Convert string statuses to OrderStatus enums
        List<Order.OrderStatus> orderStatuses = statuses.stream()
                .map(status -> {
                    try {
                        return Order.OrderStatus.valueOf(status.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        // If invalid status, default to ORDER_PENDING
                        return Order.OrderStatus.ORDER_PENDING;
                    }
                })
                .collect(Collectors.toList());
        
        List<ShopOrderDTO> orders = shopOrderService.getOrdersByShopOwnerAndStatus(shopOwnerNic, orderStatuses);
        return ResponseEntity.ok(orders);
    }

    /**
     * Update order status (confirm, process, prepare for shipping)
     */
    @PutMapping("/update-status")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ShopOrderDTO> updateOrderStatus(
            @RequestBody OrderStatusUpdateDTO updateDTO,
            Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        ShopOrderDTO updatedOrder = shopOrderService.updateOrderStatus(updateDTO, shopOwnerNic);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Confirm an order
     */
    @PutMapping("/confirm/{orderId}")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ShopOrderDTO> confirmOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        
        OrderStatusUpdateDTO updateDTO = new OrderStatusUpdateDTO();
        updateDTO.setOrderId(orderId);
        updateDTO.setNewStatus("confirmed");
        updateDTO.setNotes("Order confirmed by shop owner");
        
        ShopOrderDTO updatedOrder = shopOrderService.updateOrderStatus(updateDTO, shopOwnerNic);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Mark order as processing
     */
    @PutMapping("/process/{orderId}")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ShopOrderDTO> processOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        
        OrderStatusUpdateDTO updateDTO = new OrderStatusUpdateDTO();
        updateDTO.setOrderId(orderId);
        updateDTO.setNewStatus("processing");
        updateDTO.setNotes("Order is being processed");
        
        ShopOrderDTO updatedOrder = shopOrderService.updateOrderStatus(updateDTO, shopOwnerNic);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Prepare order for shipping
     */
    @PutMapping("/prepare-shipping/{orderId}")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ShopOrderDTO> prepareForShipping(
            @PathVariable Long orderId,
            Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        ShopOrderDTO updatedOrder = shopOrderService.prepareOrderForShipping(orderId, shopOwnerNic);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Cancel an order (if still pending/confirmed)
     */
    @PutMapping("/cancel/{orderId}")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ShopOrderDTO> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        
        OrderStatusUpdateDTO updateDTO = new OrderStatusUpdateDTO();
        updateDTO.setOrderId(orderId);
        updateDTO.setNewStatus("cancelled");
        updateDTO.setNotes(reason != null ? reason : "Cancelled by shop owner");
        
        ShopOrderDTO updatedOrder = shopOrderService.updateOrderStatus(updateDTO, shopOwnerNic);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Get order statistics for the shop owner
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<ShopOrderStatsDTO> getOrderStats(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        ShopOrderStatsDTO stats = shopOrderService.getShopOrderStats(shopOwnerNic);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get orders by date range
     */
    @GetMapping("/orders/date-range")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        List<ShopOrderDTO> orders = shopOrderService.getOrdersByDateRange(shopOwnerNic, startDate, endDate);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get today's orders
     */
    @GetMapping("/orders/today")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getTodayOrders(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        LocalDate today = LocalDate.now();
        List<ShopOrderDTO> orders = shopOrderService.getOrdersByDateRange(shopOwnerNic, today, today);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get this week's orders
     */
    @GetMapping("/orders/this-week")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getThisWeekOrders(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(today.getDayOfWeek().getValue() - 1);
        List<ShopOrderDTO> orders = shopOrderService.getOrdersByDateRange(shopOwnerNic, weekStart, today);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get this month's orders
     */
    @GetMapping("/orders/this-month")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<ShopOrderDTO>> getThisMonthOrders(Authentication authentication) {
        String shopOwnerNic = getCurrentUserNic(authentication);
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        List<ShopOrderDTO> orders = shopOrderService.getOrdersByDateRange(shopOwnerNic, monthStart, today);
        return ResponseEntity.ok(orders);
    }
}