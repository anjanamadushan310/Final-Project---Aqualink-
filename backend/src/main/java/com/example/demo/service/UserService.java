package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadService fileUploadService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String registerUser(String nicNumber, String name, String email,
                               String phoneNumber, String password, String confirmPassword,
                               MultipartFile nicDocument, List<String> userRoles) {
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

            // Upload NIC document
            String nicDocumentPath = null;
            if (nicDocument != null && !nicDocument.isEmpty()) {
                nicDocumentPath = fileUploadService.uploadFile(nicDocument);
            } else {
                return "NIC document is required";
            }

            // Convert roles list to comma-separated string
            String rolesString = String.join(",", userRoles);

            // Create new user
            User user = new User();
            user.setNicNumber(nicNumber);
            user.setName(name);
            user.setEmail(email);
            user.setPhoneNumber(phoneNumber);
            user.setPassword(passwordEncoder.encode(password));
            user.setNicDocumentPath(nicDocumentPath);
            user.setUserRoles(rolesString);

            userRepository.save(user);
            return "User registered successfully";

        } catch (IOException e) {
            return "Error uploading file: " + e.getMessage();
        } catch (Exception e) {
            return "Registration failed: " + e.getMessage();
        }
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
}
