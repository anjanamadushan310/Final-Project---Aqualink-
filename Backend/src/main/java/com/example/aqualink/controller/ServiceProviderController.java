package com.example.aqualink.controller;

import com.example.aqualink.entity.Service;
import com.example.aqualink.entity.ServiceBooking;
import com.example.aqualink.security.util.JwtUtil;
import com.example.aqualink.service.ServiceService;
import com.example.aqualink.dto.ServiceRequestDTO;
import com.example.aqualink.dto.BookingUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/service-provider/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('SERVICE_PROVIDER')")
public class ServiceProviderController {

    private final ServiceService serviceService;
    private final JwtUtil jwtUtils;

    @PostMapping
    public ResponseEntity<Service> createService(
            @Valid @RequestBody ServiceRequestDTO request,
            HttpServletRequest httpRequest) {

        Long serviceProviderId = getCurrentUserId(httpRequest);
        Service service = serviceService.createService(request, serviceProviderId);
        return ResponseEntity.ok(service);
    }

    @GetMapping
    public ResponseEntity<Page<Service>> getMyServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {

        Long serviceProviderId = getCurrentUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size);
        Page<Service> services = serviceService.getServiceProviderServices(serviceProviderId, pageable);
        return ResponseEntity.ok(services);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequestDTO request,
            HttpServletRequest httpRequest) {

        Long serviceProviderId = getCurrentUserId(httpRequest);
        Service service = serviceService.updateService(id, request, serviceProviderId);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<ServiceBooking>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {

        Long serviceProviderId = getCurrentUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size);
        Page<ServiceBooking> bookings = serviceService.getServiceProviderBookings(serviceProviderId, pageable);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/bookings/{id}")
    public ResponseEntity<ServiceBooking> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingUpdateRequestDTO request,
            HttpServletRequest httpRequest) {

        Long serviceProviderId = getCurrentUserId(httpRequest);
        ServiceBooking booking = serviceService.updateBookingStatus(id, request, serviceProviderId);
        return ResponseEntity.ok(booking);
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = jwtUtils.getJwtFromRequest(request);
        return jwtUtils.getUserIdFromToken(token);
    }
}
