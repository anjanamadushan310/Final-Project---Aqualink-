package com.example.aqualink.repository;

import com.example.aqualink.entity.DeliveryPersonAvailability;
import com.example.aqualink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryPersonAvailabilityRepository extends JpaRepository<DeliveryPersonAvailability, Long> {
    Optional<DeliveryPersonAvailability> findByDeliveryPersonUser(User deliveryPersonUser);
    Optional<DeliveryPersonAvailability> findByDeliveryPersonUserId(Long deliveryPersonUserId);
}