package com.example.aqualink.service;

import com.example.aqualink.dto.*;
import com.example.aqualink.entity.*;
import com.example.aqualink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryQuoteService {

    private final DeliveryQuoteRepository deliveryQuoteRepository;
    private final DeliveryQuoteRequestRepository deliveryQuoteRequestRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    /**
     * Create a delivery quote request
     */
    public DeliveryQuoteRequestDTO createQuoteRequest(DeliveryQuoteRequestDTO requestDTO, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Log the incoming request for debugging
        System.out.println("Creating quote request with orderId: " + requestDTO.getOrderId());

        // Validate that orderId is provided and valid
        if (requestDTO.getOrderId() == null || requestDTO.getOrderId() <= 0) {
            throw new RuntimeException("Order ID is required for delivery quote request. Please provide a valid order ID.");
        }

        // Verify that the order exists
        orderRepository.findById(requestDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + requestDTO.getOrderId()));

        DeliveryQuoteRequest request = new DeliveryQuoteRequest();
        request.setOrderId(requestDTO.getOrderId());
        
        // Set lastRespondingDateTime, use a default if not provided
        if (requestDTO.getLastRespondingDateTime() != null) {
            request.setLastRespondingDateTime(requestDTO.getLastRespondingDateTime());
        } else {
            // Set default deadline to 24 hours from now if not specified
            request.setLastRespondingDateTime(LocalDateTime.now().plusHours(24));
        }
        
        DeliveryQuoteRequest savedRequest = deliveryQuoteRequestRepository.save(request);
        
        return convertToDeliveryQuoteRequestDTO(savedRequest, customer);
    }

    /**
     * Get available quote requests for delivery persons
     */
    public List<DeliveryRequestForFrontendDTO> getAvailableQuoteRequestsForFrontend() {
        List<DeliveryQuoteRequest> requests = deliveryQuoteRequestRepository.findAll();
        
        return requests.stream()
                .map(this::convertToDeliveryRequestForFrontendDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a quote from delivery person
     */
    public DeliveryQuoteDTO createQuoteFromFrontend(CreateQuoteForFrontendDTO createDTO, String deliveryPersonEmail) {
        User deliveryPerson = userRepository.findByEmail(deliveryPersonEmail)
                .orElseThrow(() -> new RuntimeException("Delivery person not found"));

        DeliveryQuoteRequest request = deliveryQuoteRequestRepository.findById(createDTO.getRequestId())
                .orElseThrow(() -> new RuntimeException("Quote request not found"));

        // Check if delivery person already submitted a quote for this request
        if (deliveryQuoteRepository.existsByQuoteRequestAndDeliveryPerson(request, deliveryPerson)) {
            throw new RuntimeException("You have already submitted a quote for this request");
        }

        DeliveryQuote quote = new DeliveryQuote();
        quote.setQuoteRequest(request);
        quote.setDeliveryPerson(deliveryPerson);
        quote.setDeliveryFee(createDTO.getDeliveryFee());
        quote.setDeliveryDate(createDTO.getDeliveryDate());
        quote.setNotes(createDTO.getNotes());
        quote.setStatus(DeliveryQuote.QuoteStatus.PENDING);
        quote.setValidUntil(LocalDateTime.now().plusHours(createDTO.getValidityHours()));

        DeliveryQuote savedQuote = deliveryQuoteRepository.save(quote);
        
        return convertToDeliveryQuoteDTO(savedQuote);
    }

    /**
     * Get quotes for a specific request
     */
    public List<DeliveryQuoteDTO> getQuotesForRequest(String sessionId, String customerEmail) {
        // For now, get all quotes since sessionId mapping is not fully implemented
        List<DeliveryQuote> quotes = deliveryQuoteRepository.findAll();
        
        return quotes.stream()
                .map(this::convertToDeliveryQuoteDTO)
                .collect(Collectors.toList());
    }

    /**
     * Accept a delivery quote
     */
    public DeliveryQuoteDTO acceptQuote(Long quoteId, String customerEmail) {
        DeliveryQuote quote = deliveryQuoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found"));

        if (quote.getStatus() != DeliveryQuote.QuoteStatus.PENDING) {
            throw new RuntimeException("Quote is no longer available");
        }

        if (quote.getValidUntil().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Quote has expired");
        }

        quote.setStatus(DeliveryQuote.QuoteStatus.ACCEPTED);
        quote.setAcceptedAt(LocalDateTime.now());

        // Reject all other quotes for the same request
        List<DeliveryQuote> otherQuotes = deliveryQuoteRepository.findByQuoteRequestAndStatus(
                quote.getQuoteRequest(), DeliveryQuote.QuoteStatus.PENDING);
        
        for (DeliveryQuote otherQuote : otherQuotes) {
            if (!otherQuote.getId().equals(quoteId)) {
                otherQuote.setStatus(DeliveryQuote.QuoteStatus.REJECTED);
                deliveryQuoteRepository.save(otherQuote);
            }
        }

        DeliveryQuote savedQuote = deliveryQuoteRepository.save(quote);
        return convertToDeliveryQuoteDTO(savedQuote);
    }

    /**
     * Get customer's quote requests
     */
    public List<DeliveryQuoteRequestDTO> getCustomerQuoteRequests(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<DeliveryQuoteRequest> requests = deliveryQuoteRequestRepository.findAll();
        
        return requests.stream()
                .map(request -> convertToDeliveryQuoteRequestDTO(request, customer))
                .collect(Collectors.toList());
    }

    /**
     * Get delivery person's quotes
     */
    public List<DeliveryQuoteDTO> getDeliveryPersonQuotes(String deliveryPersonEmail) {
        User deliveryPerson = userRepository.findByEmail(deliveryPersonEmail)
                .orElseThrow(() -> new RuntimeException("Delivery person not found"));

        List<DeliveryQuote> quotes = deliveryQuoteRepository.findByDeliveryPersonOrderByCreatedAtDesc(deliveryPerson);
        
        return quotes.stream()
                .map(this::convertToDeliveryQuoteDTO)
                .collect(Collectors.toList());
    }

    // Conversion methods
    private DeliveryQuoteDTO convertToDeliveryQuoteDTO(DeliveryQuote quote) {
        DeliveryQuoteDTO dto = new DeliveryQuoteDTO();
        dto.setId(quote.getId());
        dto.setQuoteRequestId(quote.getQuoteRequest().getId());
        dto.setDeliveryPersonId(quote.getDeliveryPerson().getId());
        dto.setDeliveryPersonName(quote.getDeliveryPerson().getName());
        dto.setDeliveryPersonEmail(quote.getDeliveryPerson().getEmail());
        dto.setDeliveryPersonPhone(quote.getDeliveryPerson().getPhoneNumber());
        dto.setDeliveryFee(quote.getDeliveryFee());
        dto.setDeliveryDate(quote.getDeliveryDate());
        dto.setNotes(quote.getNotes());
        dto.setStatus(quote.getStatus());
        dto.setCreatedAt(quote.getCreatedAt());
        dto.setAcceptedAt(quote.getAcceptedAt());
        dto.setValidUntil(quote.getValidUntil());
        return dto;
    }

    private DeliveryQuoteRequestDTO convertToDeliveryQuoteRequestDTO(DeliveryQuoteRequest request, User customer) {
        DeliveryQuoteRequestDTO dto = new DeliveryQuoteRequestDTO();
        dto.setId(request.getId());
        dto.setOrderId(request.getOrderId());
        dto.setSessionId(UUID.randomUUID().toString()); // Generate session ID
        dto.setLastRespondingDateTime(request.getLastRespondingDateTime());
        dto.setCreateTime(request.getCreateTime());
        dto.setCustomerName(customer.getName());
        dto.setCustomerEmail(customer.getEmail());
        dto.setCustomerPhone(customer.getPhoneNumber());
        
        // For pickup and delivery addresses, we'll need to get them from the order
        // For now, setting placeholder values
        dto.setPickupAddress("Address to be determined from order");
        dto.setDeliveryAddress("Address to be determined from order");
        
        return dto;
    }

    private DeliveryRequestForFrontendDTO convertToDeliveryRequestForFrontendDTO(DeliveryQuoteRequest request) {
        DeliveryRequestForFrontendDTO dto = new DeliveryRequestForFrontendDTO();
        dto.setRequestId(request.getId());
        dto.setSessionId(UUID.randomUUID().toString()); // Generate session ID
        dto.setOrderId(request.getOrderId());
        dto.setCreateTime(request.getCreateTime());
        dto.setDeadline(request.getLastRespondingDateTime());
        
        // These would need to be populated from order data
        dto.setPickupAddress("Address to be determined from order");
        dto.setDeliveryAddress("Address to be determined from order");
        dto.setCustomerName("Customer name to be determined");
        dto.setCustomerPhone("Customer phone to be determined");
        dto.setOrderDetails("Order details to be determined");
        
        return dto;
    }
}