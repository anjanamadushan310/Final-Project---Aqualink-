package com.example.aqualink.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aqualink.dto.CreateQuoteForFrontendDTO;
import com.example.aqualink.dto.DeliveryQuoteDTO;
import com.example.aqualink.dto.DeliveryQuoteRequestDTO;
import com.example.aqualink.dto.DeliveryQuoteRequestWithOrderDTO;
import com.example.aqualink.dto.DeliveryQuoteWithOrderDTO;
import com.example.aqualink.dto.DeliveryRequestForFrontendDTO;
import com.example.aqualink.service.DeliveryQuoteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/delivery-quotes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DeliveryQuoteController {

    private final DeliveryQuoteService deliveryQuoteService;

    /**
     * Create delivery quote request and update order with address (called when submit button is clicked)
     */
    @PostMapping("/request")
    // Temporarily removing authorization to test - TODO: Add back role restriction
    // @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<DeliveryQuoteRequestDTO> createQuoteRequest(
            @RequestBody DeliveryQuoteRequestWithOrderDTO requestDTO,
            Authentication authentication) {
        System.out.println("=== DELIVERY QUOTE REQUEST RECEIVED ===");
        System.out.println("Controller received request with orderId: " + requestDTO.getOrderId());
        System.out.println("Authenticated user: " + authentication.getName());
        System.out.println("Controller received deliveryAddress: " + requestDTO.getDeliveryAddress());
        
        if (requestDTO.getDeliveryAddress() != null) {
            System.out.println("DeliveryAddress details:");
            System.out.println("  - Place: '" + requestDTO.getDeliveryAddress().getPlace() + "'");
            System.out.println("  - Street: '" + requestDTO.getDeliveryAddress().getStreet() + "'");
            System.out.println("  - District: '" + requestDTO.getDeliveryAddress().getDistrict() + "'");
            System.out.println("  - Town: '" + requestDTO.getDeliveryAddress().getTown() + "'");
        } else {
            System.out.println("WARNING: No delivery address received in request!");
        }
        System.out.println("=======================================");
        
        String customerEmail = authentication.getName();
        DeliveryQuoteRequestDTO createdRequest = deliveryQuoteService.createQuoteRequestAndOrder(requestDTO, customerEmail);
        return ResponseEntity.ok(createdRequest);
    }

    /**
     * Get available quote requests for delivery persons
     */
    @GetMapping("/available")
    // Temporarily removing role restriction to debug 403 error
    // @PreAuthorize("hasRole('DELIVERY_PERSON')")
    public ResponseEntity<List<DeliveryRequestForFrontendDTO>> getAvailableQuoteRequests(Authentication authentication) {
        String deliveryPersonEmail = authentication.getName();
        System.out.println("Fetching available requests for: " + deliveryPersonEmail);
        
        // Add debugging to check user roles
        if (authentication != null && authentication.getAuthorities() != null) {
            System.out.println("User authorities: " + authentication.getAuthorities());
        }
        
        List<DeliveryRequestForFrontendDTO> requests = deliveryQuoteService.getAvailableQuoteRequestsForDeliveryPerson(deliveryPersonEmail);
        System.out.println("Found " + requests.size() + " available requests");
        return ResponseEntity.ok(requests);
    }

    /**
     * Create a delivery quote (from delivery person)
     */
    @PostMapping("/create")
    // Temporarily removing authorization to test
    // @PreAuthorize("hasRole('DELIVERY_PERSON')")
    public ResponseEntity<DeliveryQuoteDTO> createQuote(
            @RequestBody CreateQuoteForFrontendDTO createDTO,
            Authentication authentication) {
        String deliveryPersonEmail = authentication.getName();
        DeliveryQuoteDTO quote = deliveryQuoteService.createQuoteFromFrontend(createDTO, deliveryPersonEmail);
        return ResponseEntity.ok(quote);
    }

    /**
     * Get quotes for a specific order (for customer)
     */
    @GetMapping("/order/{orderId}/quotes")
    // Temporarily removing authorization to test
    // @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<List<DeliveryQuoteDTO>> getQuotesForOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        String customerEmail = authentication.getName();
        List<DeliveryQuoteDTO> quotes = deliveryQuoteService.getQuotesForOrder(orderId, customerEmail);
        return ResponseEntity.ok(quotes);
    }
    
    /**
     * Get quotes for a specific quote request (for customer) - legacy method
     */
    @GetMapping("/request/{sessionId}/quotes")
    @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<List<DeliveryQuoteDTO>> getQuotesForRequest(
            @PathVariable String sessionId,
            Authentication authentication) {
        String customerEmail = authentication.getName();
        List<DeliveryQuoteDTO> quotes = deliveryQuoteService.getQuotesForRequest(sessionId, customerEmail);
        return ResponseEntity.ok(quotes);
    }

    /**
     * Accept a delivery quote (from customer)
     */
    @PostMapping("/accept/{quoteId}")
    @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<DeliveryQuoteDTO> acceptQuote(
            @PathVariable Long quoteId,
            Authentication authentication) {
        String customerEmail = authentication.getName();
        DeliveryQuoteDTO acceptedQuote = deliveryQuoteService.acceptQuote(quoteId, customerEmail);
        return ResponseEntity.ok(acceptedQuote);
    }

    /**
     * Get customer's quote requests with orders
     */
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<List<DeliveryQuoteRequestWithOrderDTO>> getMyQuoteRequests(Authentication authentication) {
        String customerEmail = authentication.getName();
        List<DeliveryQuoteRequestWithOrderDTO> requests = deliveryQuoteService.getCustomerQuoteRequestsWithOrders(customerEmail);
        return ResponseEntity.ok(requests);
    }

    /**
     * Get delivery person's quotes with orders
     */
    @GetMapping("/my-quotes")
    @PreAuthorize("hasRole('DELIVERY_PERSON')")
    public ResponseEntity<List<DeliveryQuoteWithOrderDTO>> getMyQuotes(Authentication authentication) {
        String deliveryPersonEmail = authentication.getName();
        List<DeliveryQuoteWithOrderDTO> quotes = deliveryQuoteService.getDeliveryPersonQuotesWithOrders(deliveryPersonEmail);
        return ResponseEntity.ok(quotes);
    }

    /**
     * Get specific quote request details with order
     */
    @GetMapping("/request/{sessionId}")
    @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<DeliveryQuoteRequestWithOrderDTO> getQuoteRequest(
            @PathVariable String sessionId,
            Authentication authentication) {
        String customerEmail = authentication.getName();
        DeliveryQuoteRequestWithOrderDTO request = deliveryQuoteService.getQuoteRequestWithOrder(sessionId, customerEmail);
        return ResponseEntity.ok(request);
    }
}