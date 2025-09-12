package com.example.aqualink.service;

import com.example.aqualink.entity.Service;
import com.example.aqualink.entity.Service.ApprovalStatus;
import com.example.aqualink.entity.ServiceBooking;
import com.example.aqualink.entity.ServiceReview;
import com.example.aqualink.repository.ServiceRepository;
import com.example.aqualink.repository.ServiceBookingRepository;
import com.example.aqualink.repository.ServiceReviewRepository;
import com.example.aqualink.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service as SpringService;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@SpringService
@RequiredArgsConstructor
@Transactional
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceBookingRepository bookingRepository;
    private final ServiceReviewRepository reviewRepository;

    // Public Methods (for customers)
    public Page<Service> getAllApprovedServices(Pageable pageable) {
        return serviceRepository.findByApprovalStatusAndAvailable(ApprovalStatus.APPROVED, true, pageable);
    }

    public Page<Service> searchApprovedServices(String search, Pageable pageable) {
        return serviceRepository.searchApprovedServices(search, pageable);
    }

    public Service getApprovedServiceById(Long id) {
        return serviceRepository.findById(id)
                .filter(service -> service.getApprovalStatus() == ApprovalStatus.APPROVED && service.getAvailable())
                .orElseThrow(() -> new RuntimeException("Service not found or not available"));
    }

    public Page<Service> getServicesByCategory(String category, Pageable pageable) {
        return serviceRepository.findByApprovalStatusAndCategoryAndAvailable(
                ApprovalStatus.APPROVED, category, true, pageable);
    }

    // Service Provider Methods
    public Service createService(ServiceRequestDTO request, Long serviceProviderId) {
        Service service = new Service();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());
        service.setMaxPrice(request.getMaxPrice());
        service.setImageUrl(request.getImageUrl());
        service.setDuration(request.getDuration());
        service.setLocation(request.getLocation());
        service.setRequirements(request.getRequirements());
        service.setServiceProviderId(serviceProviderId);
        service.setApprovalStatus(ApprovalStatus.PENDING);

        return serviceRepository.save(service);
    }

    public Service updateService(Long id, ServiceRequestDTO request, Long serviceProviderId) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!service.getServiceProviderId().equals(serviceProviderId)) {
            throw new RuntimeException("Unauthorized to update this service");
        }

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());
        service.setMaxPrice(request.getMaxPrice());
        service.setImageUrl(request.getImageUrl());
        service.setDuration(request.getDuration());
        service.setLocation(request.getLocation());
        service.setRequirements(request.getRequirements());

        // Reset approval if service was modified
        if (service.getApprovalStatus() == ApprovalStatus.APPROVED) {
            service.setApprovalStatus(ApprovalStatus.PENDING);
            service.setApprovedAt(null);
            service.setApprovedBy(null);
        }

        return serviceRepository.save(service);
    }

    public Page<Service> getServiceProviderServices(Long serviceProviderId, Pageable pageable) {
        return serviceRepository.findByServiceProviderIdOrderByCreatedAtDesc(serviceProviderId, pageable);
    }

    // Booking Methods
    public ServiceBooking bookService(ServiceBookingRequestDTO request, Long customerId) {
        Service service = getApprovedServiceById(request.getServiceId());

        ServiceBooking booking = new ServiceBooking();
        booking.setService(service);
        booking.setCustomerId(customerId);
        booking.setServiceProviderId(service.getServiceProviderId());
        booking.setCustomerRequirements(request.getCustomerRequirements());
        booking.setPreferredDate(LocalDateTime.parse(request.getPreferredDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        booking.setPreferredTime(request.getPreferredTime());
        booking.setCustomerLocation(request.getCustomerLocation());
        booking.setCustomerPhone(request.getCustomerPhone());

        return bookingRepository.save(booking);
    }

    public ServiceBooking updateBookingStatus(Long bookingId, BookingUpdateRequest request, Long serviceProviderId) {
        ServiceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getServiceProviderId().equals(serviceProviderId)) {
            throw new RuntimeException("Unauthorized to update this booking");
        }

        booking.setStatus(ServiceBooking.BookingStatus.valueOf(request.getStatus()));
        booking.setQuotedPrice(request.getQuotedPrice());
        booking.setProviderNotes(request.getProviderNotes());

        if (request.getStatus().equals("CONFIRMED")) {
            booking.setConfirmedAt(LocalDateTime.now());
        } else if (request.getStatus().equals("COMPLETED")) {
            booking.setCompletedAt(LocalDateTime.now());
        }

        return bookingRepository.save(booking);
    }

    public Page<ServiceBooking> getCustomerBookings(Long customerId, Pageable pageable) {
        return bookingRepository.findByCustomerIdOrderByBookedAtDesc(customerId, pageable);
    }

    public Page<ServiceBooking> getServiceProviderBookings(Long serviceProviderId, Pageable pageable) {
        return bookingRepository.findByServiceProviderIdOrderByBookedAtDesc(serviceProviderId, pageable);
    }

    // Review Methods
    public ServiceReview addReview(ServiceReviewRequestDTO request, Long customerId) {
        ServiceBooking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomerId().equals(customerId)) {
            throw new RuntimeException("Unauthorized to review this booking");
        }

        if (booking.getStatus() != ServiceBooking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Can only review completed services");
        }

        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new RuntimeException("Service already reviewed");
        }

        ServiceReview review = new ServiceReview();
        review.setService(booking.getService());
        review.setBooking(booking);
        review.setCustomerId(customerId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        ServiceReview savedReview = reviewRepository.save(review);

        // Update service rating
        updateServiceRating(booking.getService().getId());

        return savedReview;
    }

    private void updateServiceRating(Long serviceId) {
        Double avgRating = reviewRepository.getAverageRating(serviceId);
        Long reviewCount = reviewRepository.countByServiceId(serviceId);

        Service service = serviceRepository.findById(serviceId).orElse(null);
        if (service != null) {
            service.setReviewRate(avgRating != null ? avgRating : 0.0);
            service.setReviewCount(reviewCount.intValue());
            serviceRepository.save(service);
        }
    }

    // Admin Methods
    public Page<Service> getPendingApprovals(Pageable pageable) {
        return serviceRepository.findByApprovalStatusOrderByCreatedAtAsc(ApprovalStatus.PENDING, pageable);
    }

    public Service approveService(Long id, Long adminId) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setApprovalStatus(ApprovalStatus.APPROVED);
        service.setApprovedAt(LocalDateTime.now());
        service.setApprovedBy(adminId);
        service.setRejectionReason(null);

        return serviceRepository.save(service);
    }

    public Service rejectService(Long id, String reason, Long adminId) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setApprovalStatus(ApprovalStatus.REJECTED);
        service.setRejectionReason(reason);
        service.setApprovedBy(adminId);

        return serviceRepository.save(service);
    }
}
