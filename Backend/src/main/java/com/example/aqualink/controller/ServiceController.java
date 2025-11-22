package com.example.aqualink.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.aqualink.dto.ServiceBookingRequestDTO;
import com.example.aqualink.dto.ServiceReviewRequestDTO;
import com.example.aqualink.entity.Service;
import com.example.aqualink.entity.ServiceBooking;
import com.example.aqualink.entity.ServiceReview;
import com.example.aqualink.security.util.JwtUtil;
import com.example.aqualink.service.ServiceService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;
    private final JwtUtil jwtUtils;

    @GetMapping
    public ResponseEntity<Page<Service>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Service> services = serviceService.getAllApprovedServices(pageable);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Service>> searchServices(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Service> services = serviceService.searchApprovedServices(query, pageable);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Service service = serviceService.getApprovedServiceById(id);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<Service>> getServicesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Service> services = serviceService.getServicesByCategory(category, pageable);
        return ResponseEntity.ok(services);
    }

    @PostMapping("/{id}/book")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ServiceBooking> bookService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceBookingRequestDTO request,
            HttpServletRequest httpRequest) {

        request.setServiceId(id);
        Long customerId = getCurrentUserId(httpRequest);
        ServiceBooking booking = serviceService.bookService(request, customerId);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/reviews")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ServiceReview> addReview(
            @Valid @RequestBody ServiceReviewRequestDTO request,
            HttpServletRequest httpRequest) {

        Long customerId = getCurrentUserId(httpRequest);
        ServiceReview review = serviceService.addReview(request, customerId);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Page<ServiceBooking>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {

        Long customerId = getCurrentUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size);
        Page<ServiceBooking> bookings = serviceService.getCustomerBookings(customerId, pageable);
        return ResponseEntity.ok(bookings);
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = jwtUtils.getJwtFromRequest(request);
        return jwtUtils.getUserIdFromToken(token);
    }
}
