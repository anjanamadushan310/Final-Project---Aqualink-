package com.example.aqualink.controller;

import com.example.aqualink.dto.UserVerificationDTO;
import com.example.aqualink.entity.User;
import com.example.aqualink.service.AdminVerificationService;
import com.example.aqualink.security.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminVerificationService adminVerificationService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get users for verification based on status filter
     */
    @GetMapping("/users/verification")
    public ResponseEntity<?> getUsersForVerification(
            @RequestParam(value = "status", required = false) String status,
            HttpServletRequest request) {
        try {
            // Verify admin authentication
            if (!isAdminAuthenticated(request)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Admin access required"));
            }

            List<UserVerificationDTO> users;
            
            if (status == null || status.isEmpty() || "all".equalsIgnoreCase(status)) {
                users = adminVerificationService.getAllUsersForVerification();
            } else if ("pending".equalsIgnoreCase(status)) {
                users = adminVerificationService.getPendingUsers();
            } else if ("verified".equalsIgnoreCase(status)) {
                users = adminVerificationService.getVerifiedUsers();
            } else if ("rejected".equalsIgnoreCase(status)) {
                users = adminVerificationService.getRejectedUsers();
            } else {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Invalid status filter. Use: all, pending, verified, rejected"));
            }

            return ResponseEntity.ok(users);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch users: " + e.getMessage()));
        }
    }

    /**
     * Approve a user (set status to active)
     */
    @PostMapping("/users/{userId}/approve")
    public ResponseEntity<?> approveUser(
            @PathVariable Long userId,
            HttpServletRequest request) {
        try {
            // Verify admin authentication
            if (!isAdminAuthenticated(request)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Admin access required"));
            }

            Long adminId = getCurrentUserId(request);
            boolean success = adminVerificationService.approveUser(userId, adminId);

            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User approved successfully");
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Failed to approve user. User may not exist or already processed."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to approve user: " + e.getMessage()));
        }
    }

    /**
     * Reject a user (keep status as inactive)
     */
    @PostMapping("/users/{userId}/reject")
    public ResponseEntity<?> rejectUser(
            @PathVariable Long userId,
            HttpServletRequest request) {
        try {
            // Verify admin authentication
            if (!isAdminAuthenticated(request)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Admin access required"));
            }

            Long adminId = getCurrentUserId(request);
            boolean success = adminVerificationService.rejectUser(userId, adminId);

            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User rejected successfully");
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Failed to reject user. User may not exist or already processed."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to reject user: " + e.getMessage()));
        }
    }

    /**
     * Get detailed user information for verification
     */
    @GetMapping("/users/{userId}/details")
    public ResponseEntity<?> getUserDetails(
            @PathVariable Long userId,
            HttpServletRequest request) {
        try {
            // Verify admin authentication
            if (!isAdminAuthenticated(request)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Admin access required"));
            }

            UserVerificationDTO userDetails = adminVerificationService.getUserDetails(userId);
            
            if (userDetails != null) {
                return ResponseEntity.ok(userDetails);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch user details: " + e.getMessage()));
        }
    }

    /**
     * Get verification statistics
     */
    @GetMapping("/users/verification/stats")
    public ResponseEntity<?> getVerificationStats(HttpServletRequest request) {
        try {
            // Verify admin authentication
            if (!isAdminAuthenticated(request)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Admin access required"));
            }

            Map<String, Object> stats = adminVerificationService.getVerificationStats();
            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch statistics: " + e.getMessage()));
        }
    }

    /**
     * Create admin user for testing (should be secured in production)
     */
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdminUser(@RequestParam String email, @RequestParam String password) {
        try {
            boolean success = adminVerificationService.createAdminUser(email, password);
            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Admin user created successfully");
                response.put("email", email);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Failed to create admin user. Email may already exist."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create admin user: " + e.getMessage()));
        }
    }

    // Helper method to check if user is admin
    private boolean isAdminAuthenticated(HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);
            if (userId == null) {
                return false;
            }

            return adminVerificationService.isUserAdmin(userId);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Migrate existing users to have proper verification status
     * This is a one-time operation for existing data
     */
    @PostMapping("/users/migrate-verification-status")
    public ResponseEntity<?> migrateVerificationStatus(HttpServletRequest request) {
        try {
            // Verify admin authentication
            if (!isAdminAuthenticated(request)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Admin access required"));
            }

            adminVerificationService.migrateExistingUsersVerificationStatus();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User verification status migration completed successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Migration failed: " + e.getMessage()));
        }
    }

    // Helper method to get userId from JWT token claims
    private Long getCurrentUserId(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                Object userIdObj = jwtUtil.extractClaim(token, claims -> claims.get("userId"));
                if (userIdObj instanceof Integer) {
                    return ((Integer) userIdObj).longValue();
                } else if (userIdObj instanceof Long) {
                    return (Long) userIdObj;
                } else if (userIdObj instanceof String) {
                    return Long.parseLong((String) userIdObj);
                }
            }
        } catch (Exception e) {
            // Log or handle exception if needed
        }
        return null;
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}