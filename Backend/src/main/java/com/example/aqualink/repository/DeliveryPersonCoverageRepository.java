package com.example.aqualink.repository;

import com.example.aqualink.entity.DeliveryPersonCoverage;
import com.example.aqualink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryPersonCoverageRepository extends JpaRepository<DeliveryPersonCoverage, Long> {
    List<DeliveryPersonCoverage> findByDeliveryPersonUser(User deliveryPersonUser);
    List<DeliveryPersonCoverage> findByDeliveryPersonUserOrderById(User deliveryPersonUser);
}