package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByNicNumber(String nicNumber);

    // Get all users ordered by ID
    List<User> findAllByOrderByIdAsc();

    // Get active users only
    List<User> findByActiveTrue();

    // Get inactive users only
    List<User> findByActiveFalse();
}