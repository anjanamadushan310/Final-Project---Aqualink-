package com.example.aqualink.repository;

import com.example.aqualink.entity.ServiceBooking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {

    Page<ServiceBooking> findByCustomerIdOrderByBookedAtDesc(Long customerId, Pageable pageable);

    Page<ServiceBooking> findByServiceProviderIdOrderByBookedAtDesc(Long serviceProviderId, Pageable pageable);
}
