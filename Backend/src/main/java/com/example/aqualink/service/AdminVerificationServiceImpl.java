package com.example.aqualink.service;

import com.example.aqualink.dto.UserVerificationDTO;
import com.example.aqualink.entity.Role;
import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserRole;
import com.example.aqualink.entity.VerificationStatus;
import com.example.aqualink.repository.UserRepository;
import com.example.aqualink.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminVerificationServiceImpl implements AdminVerificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public List<UserVerificationDTO> getAllUsersForVerification() {
        List<User> users = userRepository.findAllByOrderByCreatedAtDesc();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserVerificationDTO> getPendingUsers() {
        // Get users with PENDING status OR users with null status (existing users)
        List<User> pendingUsers = userRepository.findByVerificationStatusOrderByCreatedAtDesc(VerificationStatus.PENDING);
        
        // Also get users with null verification status that are inactive (these are likely pending)
        List<User> nullStatusUsers = userRepository.findByVerificationStatusIsNullAndActiveFalseOrderByCreatedAtDesc();
        
        // Combine both lists
        pendingUsers.addAll(nullStatusUsers);
        
        return pendingUsers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserVerificationDTO> getVerifiedUsers() {
        // Get users with APPROVED status OR active users with null status (existing verified users)
        List<User> approvedUsers = userRepository.findByVerificationStatusOrderByCreatedAtDesc(VerificationStatus.APPROVED);
        
        // Also get users with null verification status that are active (these are likely approved)
        List<User> nullStatusActiveUsers = userRepository.findByVerificationStatusIsNullAndActiveTrueOrderByCreatedAtDesc();
        
        // Combine both lists
        approvedUsers.addAll(nullStatusActiveUsers);
        
        return approvedUsers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserVerificationDTO> getRejectedUsers() {
        List<User> users = userRepository.findByVerificationStatusOrderByCreatedAtDesc(VerificationStatus.REJECTED);
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean approveUser(Long userId, Long adminId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setActive(true);
                user.setVerificationStatus(VerificationStatus.APPROVED);
                userRepository.save(user);
                
                // Log approval action (you can add audit logging here)
                System.out.println("User " + userId + " approved by admin " + adminId + " at " + LocalDateTime.now());
                
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean rejectUser(Long userId, Long adminId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setActive(false);
                user.setVerificationStatus(VerificationStatus.REJECTED);
                userRepository.save(user);
                
                // Log rejection action (you can add audit logging here)
                System.out.println("User " + userId + " rejected by admin " + adminId + " at " + LocalDateTime.now());
                
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public UserVerificationDTO getUserDetails(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            return convertToDTO(userOptional.get());
        }
        return null;
    }

    @Override
    public Map<String, Object> getVerificationStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long pendingUsers = userRepository.countByVerificationStatus(VerificationStatus.PENDING) + 
                           userRepository.countByVerificationStatusIsNull();
        long verifiedUsers = userRepository.countByVerificationStatus(VerificationStatus.APPROVED);
        long rejectedUsers = userRepository.countByVerificationStatus(VerificationStatus.REJECTED);
        
        stats.put("total", totalUsers);
        stats.put("pending", pendingUsers);
        stats.put("verified", verifiedUsers);
        stats.put("rejected", rejectedUsers);
        
        return stats;
    }

    @Override
    public boolean isUserAdmin(Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<UserRole> userRoles = userRoleRepository.findByUserId(userId);
                
                return userRoles.stream()
                        .anyMatch(userRole -> userRole.getRoleName() == Role.ADMIN);
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean createAdminUser(String email, String password) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                return false;
            }

            // Create admin user
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail(email);
            adminUser.setNicNumber("ADMIN001");
            adminUser.setPhoneNumber("+94700000000");
            adminUser.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(password));
            adminUser.setActive(true); // Admin users are active by default
            adminUser.setEnabled(true); // Admin users are enabled by default
            
            // Set verification status to APPROVED for admin users
            adminUser.setVerificationStatus(VerificationStatus.APPROVED);
            
            // Save user first
            User savedUser = userRepository.save(adminUser);
            
            // Create admin role
            UserRole adminRole = new UserRole();
            adminRole.setUser(savedUser);
            adminRole.setRoleName(Role.ADMIN);
            userRoleRepository.save(adminRole);
            
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Convert User entity to UserVerificationDTO
     */
    private UserVerificationDTO convertToDTO(User user) {
        List<String> roles = getUserRoleNames(user.getId());
        
        String status = determineUserStatus(user);
        
        // Convert file paths to accessible URLs
        String nicFrontUrl = convertToAccessibleUrl(user.getNicFrontDocumentPath());
        String nicBackUrl = convertToAccessibleUrl(user.getNicBackDocumentPath());
        String selfieUrl = convertToAccessibleUrl(user.getSelfieDocumentPath());
        
        return new UserVerificationDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getNicNumber(),
                user.getPhoneNumber(),
                roles,
                status,
                user.getCreatedAt(),
                nicFrontUrl,
                nicBackUrl,
                selfieUrl
        );
    }

    /**
     * Convert file path to accessible URL
     */
    private String convertToAccessibleUrl(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }
        
        // If the path already starts with http, return as is
        if (filePath.startsWith("http")) {
            return filePath;
        }
        
        // Convert relative path to accessible URL
        if (filePath.startsWith("./uploads/")) {
            return "http://localhost:8080" + filePath.substring(1);
        } else if (filePath.startsWith("/uploads/")) {
            return "http://localhost:8080" + filePath;
        } else if (filePath.startsWith("uploads/")) {
            return "http://localhost:8080/" + filePath;
        } else {
            // Assume it's in uploads directory
            return "http://localhost:8080/uploads/" + filePath;
        }
    }

    /**
     * Get user role names
     */
    private List<String> getUserRoleNames(Long userId) {
        List<UserRole> userRoles = userRoleRepository.findByUserId(userId);
        return userRoles.stream()
                .map(userRole -> userRole.getRoleName().name())
                .collect(Collectors.toList());
    }

    /**
     * Determine user status for display
     */
    private String determineUserStatus(User user) {
        if (user.getVerificationStatus() != null) {
            return user.getVerificationStatus().toString();
        } else {
            // Fallback for existing users without verification status
            if (user.isActive()) {
                return "APPROVED";  // Active users without status are considered approved
            } else {
                return "PENDING";   // Inactive users without status are considered pending
            }
        }
    }
    
    /**
     * Migrate existing users to have proper verification status
     * This should be called once to update existing data
     */
    @Override
    @Transactional
    public void migrateExistingUsersVerificationStatus() {
        List<User> usersWithNullStatus = userRepository.findByVerificationStatusIsNull();
        
        for (User user : usersWithNullStatus) {
            if (user.isActive()) {
                user.setVerificationStatus(VerificationStatus.APPROVED);
            } else {
                user.setVerificationStatus(VerificationStatus.PENDING);
            }
            userRepository.save(user);
        }
        
        System.out.println("Migrated " + usersWithNullStatus.size() + " users to have verification status");
    }
}