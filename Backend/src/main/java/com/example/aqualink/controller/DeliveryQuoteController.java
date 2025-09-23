package com.example.aqualink.controller;

import com.example.aqualink.dto.*;
import com.example.aqualink.service.DeliveryQuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-quotes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DeliveryQuoteController {

    private final DeliveryQuoteService deliveryQuoteService;

    /**
     * Create a delivery quote request (from customer/shop owner)
     */
    @PostMapping("/request")
    @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<DeliveryQuoteRequestDTO> createQuoteRequest(
            @RequestBody DeliveryQuoteRequestDTO requestDTO,
            Authentication authentication) {
        String customerEmail = authentication.getName();
        DeliveryQuoteRequestDTO createdRequest = deliveryQuoteService.createQuoteRequest(requestDTO, customerEmail);
        return ResponseEntity.ok(createdRequest);
    }

    /**
     * Get available quote requests for delivery persons
     */
    @GetMapping("/available")
    @PreAuthorize("hasRole('DELIVERY_PERSON')")
    public ResponseEntity<List<DeliveryRequestForFrontendDTO>> getAvailableQuoteRequests() {
        List<DeliveryRequestForFrontendDTO> requests = deliveryQuoteService.getAvailableQuoteRequestsForFrontend();
        return ResponseEntity.ok(requests);
    }

    /**
     * Create a delivery quote (from delivery person)
     */
    @PostMapping("/create")
    @PreAuthorize("hasRole('DELIVERY_PERSON')")
    public ResponseEntity<DeliveryQuoteDTO> createQuote(
            @RequestBody CreateQuoteForFrontendDTO createDTO,
            Authentication authentication) {
        String deliveryPersonEmail = authentication.getName();
        DeliveryQuoteDTO quote = deliveryQuoteService.createQuoteFromFrontend(createDTO, deliveryPersonEmail);
        return ResponseEntity.ok(quote);
    }

    /**
     * Get quotes for a specific quote request (for customer)
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
     * Get customer's quote requests
     */
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<List<DeliveryQuoteRequestDTO>> getMyQuoteRequests(Authentication authentication) {
        String customerEmail = authentication.getName();
        List<DeliveryQuoteRequestDTO> requests = deliveryQuoteService.getCustomerQuoteRequests(customerEmail);
        return ResponseEntity.ok(requests);
    }

    /**
     * Get delivery person's quotes
     */
    @GetMapping("/my-quotes")
    @PreAuthorize("hasRole('DELIVERY_PERSON')")
    public ResponseEntity<List<DeliveryQuoteDTO>> getMyQuotes(Authentication authentication) {
        String deliveryPersonEmail = authentication.getName();
        List<DeliveryQuoteDTO> quotes = deliveryQuoteService.getDeliveryPersonQuotes(deliveryPersonEmail);
        return ResponseEntity.ok(quotes);
    }

    /**
     * Get specific quote request details
     */
    @GetMapping("/request/{sessionId}")
    @PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
    public ResponseEntity<DeliveryQuoteRequestDTO> getQuoteRequest(
            @PathVariable String sessionId,
            Authentication authentication) {
        String customerEmail = authentication.getName();
        
        // Get customer's requests and find the one with matching sessionId
        List<DeliveryQuoteRequestDTO> requests = deliveryQuoteService.getCustomerQuoteRequests(customerEmail);
        DeliveryQuoteRequestDTO request = requests.stream()
            .filter(r -> r.getSessionId().equals(sessionId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Quote request not found"));
        
        return ResponseEntity.ok(request);
    }
}