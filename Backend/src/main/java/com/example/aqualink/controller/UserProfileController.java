package com.example.aqualink.controller;

import com.example.aqualink.entity.UserProfile;
import com.example.aqualink.service.UserProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    @Autowired
    private UserProfileService userprofileService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<?> getUserProfile() {
        try {
            String userEmail = getCurrentUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("User not authenticated"));
            }

            UserProfile profile = userprofileService.getProfileByEmail(userEmail);
            if (profile == null) {
                // Return empty profile for new users
                profile = new UserProfile();
                profile.setUserEmail(userEmail);
            }

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch profile: " + e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateUserProfile(
            @RequestParam("profileData") String profileDataJson,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile) {
        try {
            String userEmail = getCurrentUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("User not authenticated"));
            }

            // Parse the profile data from JSON
            UserProfile profileData = objectMapper.readValue(profileDataJson, UserProfile.class);
            profileData.setUserEmail(userEmail);

            // Update the profile
            UserProfile updatedProfile = userprofileService.updateProfile(profileData, logoFile);

            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update profile: " + e.getMessage()));
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // This should be the email from JWT
        }
        return null;
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
