package com.example.aqualink.service;

import com.example.aqualink.entity.ServiceBooking;
import com.example.aqualink.entity.ServiceReview;
import com.example.aqualink.repository.ServiceRepository;
import com.example.aqualink.repository.ServiceBookingRepository;
import com.example.aqualink.repository.ServiceReviewRepository;
import com.example.aqualink.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceBookingRepository bookingRepository;
    private final ServiceReviewRepository reviewRepository;
    private final FileUploadService fileUploadService;

    // Public Methods (for customers)
    public Page<com.example.aqualink.entity.Service> getAllApprovedServices(Pageable pageable) {
        return serviceRepository.findByApprovalStatusAndAvailable(
                com.example.aqualink.entity.Service.ApprovalStatus.APPROVED, true, pageable);
    }

    public Page<com.example.aqualink.entity.Service> searchApprovedServices(String search, Pageable pageable) {
        return serviceRepository.searchApprovedServices(search, pageable);
    }

    public com.example.aqualink.entity.Service getApprovedServiceById(Long id) {
        return serviceRepository.findById(id)
                .filter(service -> service.getApprovalStatus() ==
                        com.example.aqualink.entity.Service.ApprovalStatus.APPROVED && service.getAvailable())
                .orElseThrow(() -> new RuntimeException("Service not found or not available"));
    }

    public Page<com.example.aqualink.entity.Service> getServicesByCategory(String category, Pageable pageable) {
        return serviceRepository.findByApprovalStatusAndCategoryAndAvailable(
                com.example.aqualink.entity.Service.ApprovalStatus.APPROVED, category, true, pageable);
    }

    // Service Provider Methods
    public com.example.aqualink.entity.Service createService(ServiceRequestDTO request, MultipartFile[] images, Long serviceProviderId) {
        com.example.aqualink.entity.Service service = new com.example.aqualink.entity.Service();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());
        service.setMaxPrice(request.getMaxPrice());
        service.setDuration(request.getDuration());
        service.setLocation(request.getLocation());
        service.setRequirements(request.getRequirements());
        service.setServiceProviderId(serviceProviderId);
        service.setApprovalStatus(com.example.aqualink.entity.Service.ApprovalStatus.PENDING);

        if (images != null && images.length > 0) {
            try {
                // Save images and set image URL (use first image as main image)
                List<String> imagePaths = fileUploadService.saveImages(images, serviceProviderId);
                if (!imagePaths.isEmpty()) {
                    service.setImageUrl(imagePaths.get(0)); // Set first image as main image URL
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to save service images: " + e.getMessage());
            }
        }

        return serviceRepository.save(service);
    }

    public com.example.aqualink.entity.Service updateService(Long id, ServiceRequestDTO request, Long serviceProviderId) {
        com.example.aqualink.entity.Service service = serviceRepository.findById(id)
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
        if (service.getApprovalStatus() == com.example.aqualink.entity.Service.ApprovalStatus.APPROVED) {
            service.setApprovalStatus(com.example.aqualink.entity.Service.ApprovalStatus.PENDING);
            service.setApprovedAt(null);
            service.setApprovedBy(null);
        }

        return serviceRepository.save(service);
    }

    public Page<com.example.aqualink.entity.Service> getServiceProviderServices(Long serviceProviderId, Pageable pageable) {
        return serviceRepository.findByServiceProviderIdOrderByCreatedAtDesc(serviceProviderId, pageable);
    }

    // Booking Methods
    public ServiceBooking bookService(ServiceBookingRequestDTO request, Long customerId) {
        com.example.aqualink.entity.Service service = getApprovedServiceById(request.getServiceId());

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

    public ServiceBooking updateBookingStatus(Long bookingId, BookingUpdateRequestDTO request, Long serviceProviderId) {
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

        com.example.aqualink.entity.Service service = serviceRepository.findById(serviceId).orElse(null);
        if (service != null) {
            service.setReviewRate(avgRating != null ? avgRating : 0.0);
            service.setReviewCount(reviewCount.intValue());
            serviceRepository.save(service);
        }
    }

    // Admin Methods
    public Page<com.example.aqualink.entity.Service> getPendingApprovals(Pageable pageable) {
        return serviceRepository.findByApprovalStatusOrderByCreatedAtAsc(
                com.example.aqualink.entity.Service.ApprovalStatus.PENDING, pageable);
    }

    public com.example.aqualink.entity.Service approveService(Long id, Long adminId) {
        com.example.aqualink.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setApprovalStatus(com.example.aqualink.entity.Service.ApprovalStatus.APPROVED);
        service.setApprovedAt(LocalDateTime.now());
        service.setApprovedBy(adminId);
        service.setRejectionReason(null);

        return serviceRepository.save(service);
    }

    public com.example.aqualink.entity.Service rejectService(Long id, String reason, Long adminId) {
        com.example.aqualink.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setApprovalStatus(com.example.aqualink.entity.Service.ApprovalStatus.REJECTED);
        service.setRejectionReason(reason);
        service.setApprovedBy(adminId);

        return serviceRepository.save(service);
    }
}
