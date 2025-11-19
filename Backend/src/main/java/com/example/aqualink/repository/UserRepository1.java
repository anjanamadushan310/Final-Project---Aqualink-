package com.example.aqualink.repository;

import com.example.aqualink.entity.User1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository1 extends JpaRepository<User1, Long> {
    Optional<User1> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNicNumber(String nicNumber);
}
