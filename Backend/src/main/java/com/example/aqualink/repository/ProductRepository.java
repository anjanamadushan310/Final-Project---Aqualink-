package com.example.aqualink.repository;

import com.example.aqualink.entity.Product;
import com.example.aqualink.entity.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveStatus(ActiveStatus status);

    List<Product> findByRole(String role);

    List<Product> findByUserId(String userId);

    List<Product> findByActiveStatusAndRole(ActiveStatus status, String role);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByTown(String town);

    long countByActiveStatus(ActiveStatus status);
}
