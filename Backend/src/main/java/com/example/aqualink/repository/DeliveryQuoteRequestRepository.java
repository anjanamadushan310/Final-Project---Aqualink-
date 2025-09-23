package com.example.aqualink.repository;

import com.example.aqualink.entity.DeliveryQuoteRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryQuoteRequestRepository extends JpaRepository<DeliveryQuoteRequest, Long> {
    
    List<DeliveryQuoteRequest> findByOrderId(Long orderId);
    
    List<DeliveryQuoteRequest> findByOrderIdOrderByCreateTimeDesc(Long orderId);
}