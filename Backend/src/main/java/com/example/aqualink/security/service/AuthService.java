package com.example.aqualink.security.service;

import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserRole;
import com.example.aqualink.entity.Role;
import com.example.aqualink.repository.UserRepository;
import com.example.aqualink.repository.UserRoleRepository;
import com.example.aqualink.security.dto.LoginRequest;
import com.example.aqualink.security.dto.LoginResponse;
import com.example.aqualink.security.util.JwtUtil;
import com.example.aqualink.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String registerUser(String nicNumber, String name, String email,
                               String phoneNumber, String password, String confirmPassword,
                               MultipartFile nicFrontDocument, MultipartFile nicBackDocument,
                               MultipartFile selfieDocument, List<String> userRoles) {
        try {
            // Check if passwords match
            if (!password.equals(confirmPassword)) {
                return "Passwords do not match";
            }

            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                return "Email already exists";
            }

            // Check if NIC already exists
            if (userRepository.existsByNicNumber(nicNumber)) {
                return "NIC number already exists";
            }

            // Validate user roles
            if (userRoles == null || userRoles.isEmpty()) {
                return "Please select at least one role";
            }

            // Upload documents
            String nicFrontPath = null;
            String nicBackPath = null;
            String selfiePath = null;

            if (nicFrontDocument != null && !nicFrontDocument.isEmpty()) {
                nicFrontPath = fileUploadService.uploadFile(nicFrontDocument);
            }

            if (nicBackDocument != null && !nicBackDocument.isEmpty()) {
                nicBackPath = fileUploadService.uploadFile(nicBackDocument);
            }

            if (selfieDocument != null && !selfieDocument.isEmpty()) {
                selfiePath = fileUploadService.uploadFile(selfieDocument);
            }

            // Validate at least one document is uploaded
            if (nicFrontPath == null && nicBackPath == null && selfiePath == null) {
                return "At least one document is required";
            }

            // Create new user
            User user = new User();
            user.setNicNumber(nicNumber);
            user.setName(name);
            user.setEmail(email);
            user.setPhoneNumber(phoneNumber);
            user.setPassword(passwordEncoder.encode(password));
            user.setNicFrontDocumentPath(nicFrontPath);
            user.setNicBackDocumentPath(nicBackPath);
            user.setSelfieDocumentPath(selfiePath);
            user.setActive(true);

            // Save user first to get ID
            userRepository.save(user);

            // Create and save user roles
            Set<UserRole> roles = new HashSet<>();
            for (String roleStr : userRoles) {
                UserRole userRole = new UserRole();
                userRole.setUser(user);
                userRole.setRoleName(Role.valueOf(roleStr));
                roles.add(userRole);
            }
            userRoleRepository.saveAll(roles);

            return "User registered successfully";

        } catch (IOException e) {
            return "Error uploading file: " + e.getMessage();
        } catch (Exception e) {
            return "Registration failed: " + e.getMessage();
        }
    }

    // Login method
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // Admin methods
    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc();
    }

    public List<User> getActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    public List<User> getInactiveUsers() {
        return userRepository.findByActiveFalse();
    }

    public boolean deactivateUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActive(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean activateUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActive(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Transactional(readOnly = true)
    public LoginResponse authenticate(LoginRequest loginRequest) {
        try {
            if (loginRequest == null) {
                throw new RuntimeException("Login request cannot be null");
            }

            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                throw new RuntimeException("Password is required");
            }

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> {
                        System.out.println("ERROR: User not found: " + loginRequest.getEmail());
                        return new RuntimeException("Invalid email or password");
                    });

            if (!user.isActive()) {
                System.out.println("ERROR: User account is inactive: " + loginRequest.getEmail());
                throw new RuntimeException("Account is inactive");
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                System.out.println("ERROR: Password mismatch for: " + loginRequest.getEmail());
                throw new RuntimeException("Invalid email or password");
            }

            List<UserRole> userRolesList = userRoleRepository.findByUserId(user.getId());
            System.out.println("Found " + userRolesList.size() + " user roles");

            Set<Role> roles = new HashSet<>();
            for (UserRole userRole : userRolesList) {
                if (userRole != null && userRole.getRoleName() != null) {
                    roles.add(userRole.getRoleName());
                    System.out.println("Added role: " + userRole.getRoleName());
                }
            }

            if (roles.isEmpty()) {
                System.out.println("ERROR: No roles found for user: " + loginRequest.getEmail());
                throw new RuntimeException("User has no assigned roles");
            }

            String token;
            try {
                token = jwtUtil.generateToken(user.getEmail(), roles);
                System.out.println("Token generated successfully");
            } catch (Exception e) {
                System.out.println("ERROR: Failed to generate token: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to generate authentication token");
            }

            LoginResponse response = new LoginResponse(token, roles, user.getNicNumber());
            return response;

        } catch (RuntimeException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Authentication failed due to unexpected error: " + e.getMessage());
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
