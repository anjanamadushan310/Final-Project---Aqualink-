package com.example.aqualink.controller;

import com.example.aqualink.entity.Role;
import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserRole;
import com.example.aqualink.entity.VerificationStatus;
import com.example.aqualink.repository.UserRepository;
import com.example.aqualink.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-test-users")
    public ResponseEntity<?> createTestUsers() {
        try {
            // Create PENDING user
            if (!userRepository.existsByEmail("pending.user@test.com")) {
                User pendingUser = new User();
                pendingUser.setName("Pending User");
                pendingUser.setEmail("pending.user@test.com");
                pendingUser.setNicNumber("123456789V");
                pendingUser.setPhoneNumber("+94771234567");
                pendingUser.setPassword(passwordEncoder.encode("password123"));
                pendingUser.setActive(false);
                pendingUser.setEnabled(true);
                pendingUser.setVerificationStatus(VerificationStatus.PENDING);
                pendingUser.setCreatedAt(LocalDateTime.now());
                pendingUser.setNicFrontDocumentPath("uploads/test-nic-front.jpg");
                pendingUser.setNicBackDocumentPath("uploads/test-nic-back.jpg");
                pendingUser.setSelfieDocumentPath("uploads/test-selfie.jpg");

                User savedPending = userRepository.save(pendingUser);

                UserRole customerRole = new UserRole();
                customerRole.setUser(savedPending);
                customerRole.setRoleName(Role.FARM_OWNER);
                userRoleRepository.save(customerRole);
            }

            // Create APPROVED user
            if (!userRepository.existsByEmail("approved.user@test.com")) {
                User approvedUser = new User();
                approvedUser.setName("Approved User");
                approvedUser.setEmail("approved.user@test.com");
                approvedUser.setNicNumber("987654321V");
                approvedUser.setPhoneNumber("+94779876543");
                approvedUser.setPassword(passwordEncoder.encode("password123"));
                approvedUser.setActive(true);
                approvedUser.setEnabled(true);
                approvedUser.setVerificationStatus(VerificationStatus.APPROVED);
                approvedUser.setCreatedAt(LocalDateTime.now().minusDays(1));
                approvedUser.setNicFrontDocumentPath("uploads/test-nic-front-2.jpg");
                approvedUser.setNicBackDocumentPath("uploads/test-nic-back-2.jpg");
                approvedUser.setSelfieDocumentPath("uploads/test-selfie-2.jpg");

                User savedApproved = userRepository.save(approvedUser);

                UserRole customerRole2 = new UserRole();
                customerRole2.setUser(savedApproved);
                customerRole2.setRoleName(Role.SHOP_OWNER);
                userRoleRepository.save(customerRole2);
            }

            // Create REJECTED user
            if (!userRepository.existsByEmail("rejected.user@test.com")) {
                User rejectedUser = new User();
                rejectedUser.setName("Rejected User");
                rejectedUser.setEmail("rejected.user@test.com");
                rejectedUser.setNicNumber("555666777V");
                rejectedUser.setPhoneNumber("+94775556667");
                rejectedUser.setPassword(passwordEncoder.encode("password123"));
                rejectedUser.setActive(false);
                rejectedUser.setEnabled(true);
                rejectedUser.setVerificationStatus(VerificationStatus.REJECTED);
                rejectedUser.setCreatedAt(LocalDateTime.now().minusDays(2));
                rejectedUser.setNicFrontDocumentPath("uploads/test-nic-front-3.jpg");
                rejectedUser.setNicBackDocumentPath("uploads/test-nic-back-3.jpg");
                rejectedUser.setSelfieDocumentPath("uploads/test-selfie-3.jpg");

                User savedRejected = userRepository.save(rejectedUser);

                UserRole customerRole3 = new UserRole();
                customerRole3.setUser(savedRejected);
                customerRole3.setRoleName(Role.EXPORTER);
                userRoleRepository.save(customerRole3);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Test users created successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create test users: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/user-count")
    public ResponseEntity<?> getUserCount() {
        try {
            long totalUsers = userRepository.count();
            long pendingUsers = userRepository.countByVerificationStatus(VerificationStatus.PENDING);
            long approvedUsers = userRepository.countByVerificationStatus(VerificationStatus.APPROVED);
            long rejectedUsers = userRepository.countByVerificationStatus(VerificationStatus.REJECTED);

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", totalUsers);
            stats.put("pending", pendingUsers);
            stats.put("approved", approvedUsers);
            stats.put("rejected", rejectedUsers);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get user count: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}