package com.example.aqualink.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.aqualink.dto.CreateQuoteForFrontendDTO;
import com.example.aqualink.dto.DeliveryQuoteDTO;
import com.example.aqualink.dto.DeliveryQuoteRequestDTO;
import com.example.aqualink.dto.DeliveryQuoteRequestWithOrderDTO;
import com.example.aqualink.dto.DeliveryQuoteWithOrderDTO;
import com.example.aqualink.dto.DeliveryRequestForFrontendDTO;
import com.example.aqualink.entity.DeliveryPersonAvailability;
import com.example.aqualink.entity.DeliveryPersonCoverage;
import com.example.aqualink.entity.DeliveryQuote;
import com.example.aqualink.entity.DeliveryQuoteRequest;
import com.example.aqualink.entity.Order;
import com.example.aqualink.entity.OrderItem;
import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserProfile;
import com.example.aqualink.repository.DeliveryPersonAvailabilityRepository;
import com.example.aqualink.repository.DeliveryPersonCoverageRepository;
import com.example.aqualink.repository.DeliveryQuoteRepository;
import com.example.aqualink.repository.DeliveryQuoteRequestRepository;
import com.example.aqualink.repository.OrderRepository;
import com.example.aqualink.repository.UserProfileRepository;
import com.example.aqualink.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryQuoteService {

    private final DeliveryQuoteRepository deliveryQuoteRepository;
    private final DeliveryQuoteRequestRepository deliveryQuoteRequestRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final DeliveryPersonCoverageRepository coverageRepository;
    private final DeliveryPersonAvailabilityRepository deliveryPersonAvailabilityRepository;
    private final UserProfileRepository userProfileRepository;

    /**
     * Create initial order for delivery quote request (called when page loads)
     */
    public DeliveryQuoteRequestDTO createInitialOrderForQuoteRequest(DeliveryQuoteRequestWithOrderDTO requestDTO, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Create initial order with basic information
        Order order = new Order();
        order.setBuyerUser(customer);
        order.setOrderStatus(Order.OrderStatus.DELIVERY_PENDING);
        order.setTotalAmount(BigDecimal.valueOf(requestDTO.getSubtotal()));
        order.setOrderDateTime(LocalDateTime.now());

        // Add order items
        if (requestDTO.getItems() != null) {
            List<OrderItem> orderItems = requestDTO.getItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setPrice(BigDecimal.valueOf(item.getPrice()));
                    // Set product - you'll need to fetch it or create a new one
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());
            order.setOrderItems(orderItems);
        }

        // Note: Address will be set later when submit button is clicked
        Order savedOrder = orderRepository.save(order);

        // Create quote request
        DeliveryQuoteRequest request = new DeliveryQuoteRequest();
        request.setOrderId(savedOrder.getId());
        request.setLastRespondingDateTime(
            requestDTO.getPreferences() != null && requestDTO.getPreferences().getQuotesExpireOn() != null 
            ? requestDTO.getPreferences().getQuotesExpireOn() 
            : LocalDateTime.now().plusHours(24)
        );
        
        DeliveryQuoteRequest savedRequest = deliveryQuoteRequestRepository.save(request);
        
        return convertToDeliveryQuoteRequestDTO(savedRequest, customer);
    }

    /**
     * Update existing order with delivery address (called when submit button is clicked)
     */
    public DeliveryQuoteRequestDTO updateOrderAddressAndFinalizeRequest(Long orderId, DeliveryQuoteRequestWithOrderDTO requestDTO, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Find existing order
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify the order belongs to this customer
        if (!existingOrder.getBuyerUser().getId().equals(customer.getId())) {
            throw new RuntimeException("Order does not belong to this customer");
        }

        // Update delivery address from the request
        if (requestDTO.getDeliveryAddress() != null) {
            System.out.println("Updating order address - Place: " + requestDTO.getDeliveryAddress().getPlace());
            System.out.println("Updating order address - Street: " + requestDTO.getDeliveryAddress().getStreet());
            System.out.println("Updating order address - District: " + requestDTO.getDeliveryAddress().getDistrict());
            System.out.println("Updating order address - Town: " + requestDTO.getDeliveryAddress().getTown());
            
            existingOrder.setAddressPlace(requestDTO.getDeliveryAddress().getPlace());
            existingOrder.setAddressStreet(requestDTO.getDeliveryAddress().getStreet());
            existingOrder.setAddressDistrict(requestDTO.getDeliveryAddress().getDistrict());
            existingOrder.setAddressTown(requestDTO.getDeliveryAddress().getTown());
            
            System.out.println("Order address updated successfully for order ID: " + existingOrder.getId());
        } else {
            System.out.println("No delivery address provided in request");
        }

        // Update total amount if changed
        existingOrder.setTotalAmount(BigDecimal.valueOf(requestDTO.getSubtotal()));

        // Save the updated order
        Order updatedOrder = orderRepository.save(existingOrder);
        System.out.println("Order saved successfully with ID: " + updatedOrder.getId());
        
        // Verify the address was saved correctly
        System.out.println("Saved order address verification:");
        System.out.println("  - Place: " + updatedOrder.getAddressPlace());
        System.out.println("  - Street: " + updatedOrder.getAddressStreet());
        System.out.println("  - District: " + updatedOrder.getAddressDistrict());
        System.out.println("  - Town: " + updatedOrder.getAddressTown());

        // Find the associated quote request
        List<DeliveryQuoteRequest> requests = deliveryQuoteRequestRepository.findByOrderId(updatedOrder.getId());
        if (requests.isEmpty()) {
            throw new RuntimeException("Quote request not found");
        }
        DeliveryQuoteRequest request = requests.get(0); // Get the first (should be only one)

        return convertToDeliveryQuoteRequestDTO(request, customer);
    }

    /**
     * Create a delivery quote request and update order with address (called when submit button is clicked)
     */
    public DeliveryQuoteRequestDTO createQuoteRequestAndOrder(DeliveryQuoteRequestWithOrderDTO requestDTO, String customerEmail) {
        System.out.println("createQuoteRequestAndOrder called with orderId: " + requestDTO.getOrderId());
        System.out.println("Customer email: " + customerEmail);
        
        // Check if an orderId is provided (for updating existing order)
        if (requestDTO.getOrderId() != null) {
            System.out.println("Updating existing order with ID: " + requestDTO.getOrderId());
            return updateOrderAddressAndFinalizeRequest(requestDTO.getOrderId(), requestDTO, customerEmail);
        } else {
            System.out.println("Creating new order (no orderId provided)");
            // Create new order (fallback for backward compatibility)
            return createInitialOrderForQuoteRequest(requestDTO, customerEmail);
        }
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
     * Get available quote requests for a specific delivery person based on their coverage area
     */
    public List<DeliveryRequestForFrontendDTO> getAvailableQuoteRequestsForDeliveryPerson(String deliveryPersonEmail) {
        User deliveryPerson = userRepository.findByEmail(deliveryPersonEmail)
                .orElseThrow(() -> new RuntimeException("Delivery person not found"));

        // Check if delivery person is currently available
        Optional<DeliveryPersonAvailability> availabilityOpt = 
                deliveryPersonAvailabilityRepository.findByDeliveryPersonUser(deliveryPerson);
        
        if (availabilityOpt.isPresent() && !availabilityOpt.get().getIsAvailable()) {
            System.out.println("Delivery person is not available, returning empty list");
            return new ArrayList<>();
        }

        // Get delivery person's coverage areas
        List<DeliveryPersonCoverage> coverageAreas = coverageRepository.findByDeliveryPersonUser(deliveryPerson);
        
        if (coverageAreas.isEmpty()) {
            System.out.println("Delivery person has no coverage areas configured, returning empty list");
            return new ArrayList<>();
        }
        
        // Extract all covered districts and towns from "District:Town" format
        Set<String> coveredDistrictTownPairs = new HashSet<>();
        Set<String> coveredDistricts = new HashSet<>();
        Set<String> coveredTowns = new HashSet<>();
        
        for (DeliveryPersonCoverage coverage : coverageAreas) {
            List<String> towns = coverage.getTowns();
            for (String districtTown : towns) {
                coveredDistrictTownPairs.add(districtTown);
                if (districtTown.contains(":")) {
                    String[] parts = districtTown.split(":");
                    if (parts.length == 2) {
                        coveredDistricts.add(parts[0]);
                        coveredTowns.add(parts[1]);
                    }
                }
            }
        }

        System.out.println("Delivery person coverage - District:Town pairs: " + coveredDistrictTownPairs);

        // Get all quote requests
        List<DeliveryQuoteRequest> allRequests = deliveryQuoteRequestRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        
        return allRequests.stream()
                .filter(request -> {
                    // Filter by expiration time - check if quotes are still accepting
                    // First check explicit expiry time if set
                    if (request.getLastRespondingDateTime() != null && 
                        request.getLastRespondingDateTime().isBefore(now)) {
                        System.out.println("Request " + request.getId() + " expired at " + request.getLastRespondingDateTime());
                        return false;
                    }
                    
                    // Also check if request has been created too long ago (default 72 hours if no explicit expiry)
                    if (request.getLastRespondingDateTime() == null) {
                        LocalDateTime defaultExpiry = request.getCreateTime().plusHours(72); // Default 72 hours
                        if (defaultExpiry.isBefore(now)) {
                            System.out.println("Request " + request.getId() + " expired by default timeout (72 hours)");
                            return false;
                        }
                    }
                    
                    // Get the associated order
                    Order order = orderRepository.findById(request.getOrderId()).orElse(null);
                    if (order == null) {
                        System.out.println("Order not found for request " + request.getId());
                        return false;
                    }
                    
                    // Filter by delivery address coverage (customer delivery location)
                    String orderDistrict = order.getAddressDistrict();
                    String orderTown = order.getAddressTown();
                    
                    if (orderDistrict == null || orderTown == null || 
                        orderDistrict.isEmpty() || orderTown.isEmpty()) {
                        System.out.println("Order " + order.getId() + " missing delivery address information");
                        return false;
                    }
                    
                    String deliveryDistrictTownPair = orderDistrict + ":" + orderTown;
                    if (!coveredDistrictTownPairs.contains(deliveryDistrictTownPair)) {
                        System.out.println("Order " + order.getId() + " delivery address (" + 
                                         deliveryDistrictTownPair + ") not in coverage area");
                        return false;
                    }
                    
                    // Filter by seller location coverage (pickup location)
                    User orderCustomer = order.getBuyerUser();
                    if (orderCustomer != null) {
                        // Try to get seller location from customer's profile
                        Optional<UserProfile> customerProfile = userProfileRepository.findByUserId(orderCustomer.getId());
                        if (customerProfile.isPresent()) {
                            UserProfile profile = customerProfile.get();
                            String sellerDistrict = profile.getAddressDistrict();
                            String sellerTown = profile.getAddressTown();
                            
                            // If seller location is available, check if it's in coverage area
                            if (sellerDistrict != null && sellerTown != null && 
                                !sellerDistrict.isEmpty() && !sellerTown.isEmpty()) {
                                
                                String sellerDistrictTownPair = sellerDistrict + ":" + sellerTown;
                                if (!coveredDistrictTownPairs.contains(sellerDistrictTownPair)) {
                                    System.out.println("Order " + order.getId() + " seller location (" + 
                                                     sellerDistrictTownPair + ") not in coverage area");
                                    return false;
                                }
                            }
                        }
                    }
                    
                    return true;
                })
                .filter(request -> {
                    // Filter out requests where this delivery person already submitted a quote
                    boolean hasQuoted = deliveryQuoteRepository.existsByQuoteRequestAndDeliveryPerson(request, deliveryPerson);
                    if (hasQuoted) {
                        System.out.println("Delivery person already quoted for request " + request.getId());
                    }
                    return !hasQuoted;
                })
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
     * Accept a delivery quote and update order
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

        // Update order with accepted quote information
        Order order = orderRepository.findById(quote.getQuoteRequest().getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setAcceptedDeliveryQuoteId(quote.getId());
        order.setOrderStatus(Order.OrderStatus.ORDER_PENDING);
        orderRepository.save(order);

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
     * Get customer's quote requests with orders
     */
    public List<DeliveryQuoteRequestWithOrderDTO> getCustomerQuoteRequestsWithOrders(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Find requests where the order belongs to this customer
        List<DeliveryQuoteRequest> requests = deliveryQuoteRequestRepository.findAll()
                .stream()
                .filter(request -> {
                    Order order = orderRepository.findById(request.getOrderId())
                            .orElseThrow(() -> new RuntimeException("Order not found"));
                    return order.getBuyerUser().getId().equals(customer.getId());
                })
                .collect(Collectors.toList());
        
        return requests.stream()
                .map(request -> {
                    Order order = orderRepository.findById(request.getOrderId())
                            .orElseThrow(() -> new RuntimeException("Order not found"));
                    
                    DeliveryQuoteRequestWithOrderDTO dto = new DeliveryQuoteRequestWithOrderDTO();
                    dto.setSessionId(UUID.randomUUID().toString()); // Generate session ID for tracking
                    dto.setStatus(order.getOrderStatus().toString());
                    dto.setCreatedAt(order.getOrderDateTime());
                    dto.setSubtotal(order.getTotalAmount().doubleValue());
                    
                    // Convert order items
                    dto.setItems(order.getOrderItems().stream()
                            .map(item -> {
                                DeliveryQuoteRequestWithOrderDTO.CartItemDTO itemDto = 
                                    new DeliveryQuoteRequestWithOrderDTO.CartItemDTO();
                                itemDto.setQuantity(item.getQuantity());
                                itemDto.setPrice(item.getPrice().doubleValue());
                                itemDto.setProductName(item.getProduct().getName());
                                return itemDto;
                            })
                            .collect(Collectors.toList()));
                    
                    // Set preferences
                    DeliveryQuoteRequestWithOrderDTO.OrderPreferencesDTO preferences = 
                        new DeliveryQuoteRequestWithOrderDTO.OrderPreferencesDTO();
                    preferences.setQuotesExpireAfter(24); // Default 24 hours
                    preferences.setQuotesExpireOn(request.getLastRespondingDateTime());
                    dto.setPreferences(preferences);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get specific quote request with order
     */
    public DeliveryQuoteRequestWithOrderDTO getQuoteRequestWithOrder(String sessionId, String customerEmail) {
        // Get requests filtered by customer and find the one with matching sessionId
        List<DeliveryQuoteRequestWithOrderDTO> allRequests = getCustomerQuoteRequestsWithOrders(customerEmail);
        return allRequests.stream()
                .filter(req -> sessionId.equals(req.getSessionId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Quote request not found"));
    }

    /**
     * Get delivery person's quotes with orders
     */
    public List<DeliveryQuoteWithOrderDTO> getDeliveryPersonQuotesWithOrders(String deliveryPersonEmail) {
        User deliveryPerson = userRepository.findByEmail(deliveryPersonEmail)
                .orElseThrow(() -> new RuntimeException("Delivery person not found"));

        List<DeliveryQuote> quotes = deliveryQuoteRepository.findByDeliveryPersonOrderByCreatedAtDesc(deliveryPerson);
        
        return quotes.stream()
                .map(quote -> {
                    Order order = orderRepository.findById(quote.getQuoteRequest().getOrderId())
                            .orElseThrow(() -> new RuntimeException("Order not found"));
                    
                    DeliveryQuoteWithOrderDTO dto = new DeliveryQuoteWithOrderDTO();
                    dto.setId(quote.getId());
                    dto.setDeliveryFee(quote.getDeliveryFee());
                    dto.setDeliveryDate(quote.getDeliveryDate().atStartOfDay());
                    dto.setStatus(quote.getStatus());
                    dto.setOrderId(order.getId());
                    dto.setOrderStatus(order.getOrderStatus());
                    dto.setTotalAmount(order.getTotalAmount());
                    
                    return dto;
                })
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
        dto.setSessionId("ORDER-" + request.getOrderId() + "-REQ-" + request.getId()); // Generate consistent session ID
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
        dto.setOrderId(request.getOrderId());
        dto.setCreateTime(request.getCreateTime());
        dto.setDeadline(request.getLastRespondingDateTime());
        dto.setSessionId(UUID.randomUUID().toString()); // Generate a session ID for tracking
        
        // Get order details
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Set pickup address (seller/shop location - for now using placeholder)
        dto.setPickupAddress("Shop Location - To be determined");
        
        // Set delivery address from order
        String deliveryAddress = String.format("%s, %s, %s, %s",
                order.getAddressPlace() != null ? order.getAddressPlace() : "",
                order.getAddressStreet() != null ? order.getAddressStreet() : "",
                order.getAddressDistrict() != null ? order.getAddressDistrict() : "",
                order.getAddressTown() != null ? order.getAddressTown() : "")
                .replaceAll(", ,", ",").replaceAll("^,|,$", ""); // Clean up empty fields
        
        dto.setDeliveryAddress(deliveryAddress);
        dto.setDistrict(order.getAddressDistrict());
        dto.setTown(order.getAddressTown());
        
        User customer = order.getBuyerUser();
        dto.setCustomerName(customer.getName());
        dto.setCustomerPhone(customer.getPhoneNumber());
        
        // Set order totals
        dto.setTotalAmount(order.getTotalAmount().doubleValue());
        dto.setTotalItems(order.getOrderItems() != null ? order.getOrderItems().size() : 0);
        
        dto.setOrderDetails(String.format("Order #%d - %d items, Total: Rs.%.2f", 
            order.getId(),
            dto.getTotalItems(),
            dto.getTotalAmount()));
        
        return dto;
    }
}