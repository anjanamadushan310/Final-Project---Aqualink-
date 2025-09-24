package com.example.aqualink.repository;

import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserProfile;
import com.example.aqualink.entity.VerificationStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

    // Find user by email for login
    Optional<User> findByEmail(String email);

    // Find active user by email
    Optional<User> findByEmailAndActiveTrue(String email);

    // Find user by NIC number
    Optional<User> findByNicNumber(String nicNumber);
    
    // Find active user by NIC number
    Optional<User> findByNicNumberAndActiveTrue(String nicNumber);

    // New method to fetch user with roles eagerly
    @EntityGraph(attributePaths = {"userRoles"})
    Optional<User> findWithRolesByEmail(String email);

    // Admin verification methods
    List<User> findByActiveFalseOrderByCreatedAtDesc();
    
    List<User> findByActiveTrueOrderByCreatedAtDesc();
    
    List<User> findAllByOrderByCreatedAtDesc();
    
    // Find users by verification status
    List<User> findByVerificationStatusOrderByCreatedAtDesc(VerificationStatus verificationStatus);
    
    // Find users with null verification status (for backward compatibility)
    List<User> findByVerificationStatusIsNullAndActiveFalseOrderByCreatedAtDesc();
    
    List<User> findByVerificationStatusIsNullAndActiveTrueOrderByCreatedAtDesc();
    
    // Find all users with null verification status
    List<User> findByVerificationStatusIsNull();

    // Count methods for verification stats
    long countByVerificationStatus(VerificationStatus verificationStatus);
    long countByVerificationStatusIsNull();
}