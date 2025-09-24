package com.example.aqualink.service;

import com.example.aqualink.dto.UserVerificationDTO;
import java.util.List;
import java.util.Map;

public interface AdminVerificationService {
    
    /**
     * Get all users for verification (all statuses)
     */
    List<UserVerificationDTO> getAllUsersForVerification();
    
    /**
     * Get pending users (inactive status)
     */
    List<UserVerificationDTO> getPendingUsers();
    
    /**
     * Get verified users (active status)
     */
    List<UserVerificationDTO> getVerifiedUsers();
    
    /**
     * Get rejected users
     */
    List<UserVerificationDTO> getRejectedUsers();
    
    /**
     * Approve a user (set status to active)
     */
    boolean approveUser(Long userId, Long adminId);
    
    /**
     * Reject a user (keep status inactive with rejection flag)
     */
    boolean rejectUser(Long userId, Long adminId);
    
    /**
     * Get detailed user information for verification
     */
    UserVerificationDTO getUserDetails(Long userId);
    
    /**
     * Get verification statistics
     */
    Map<String, Object> getVerificationStats();
    
    /**
     * Check if a user has admin role
     */
    boolean isUserAdmin(Long userId);
    
    /**
     * Create admin user for testing purposes
     */
    boolean createAdminUser(String email, String password);
    
    /**
     * Migrate existing users to have proper verification status
     */
    void migrateExistingUsersVerificationStatus();
}