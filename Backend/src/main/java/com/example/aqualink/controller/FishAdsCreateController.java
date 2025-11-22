package com.example.aqualink.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.aqualink.dto.FishAdsRequestDTO;
import com.example.aqualink.entity.Fish;
import com.example.aqualink.service.FishAdsCreateService;
import com.example.aqualink.security.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/fish-ads")
public class FishAdsCreateController {

    private final FishAdsCreateService fishService;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    public FishAdsCreateController(FishAdsCreateService fishService, ObjectMapper objectMapper, JwtUtil jwtUtil) {
        this.fishService = fishService;
        this.objectMapper = objectMapper;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createFishAd(
            HttpServletRequest request,
            @RequestPart("fishAdsRequest") String fishAdsRequestJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {

        try {
            // Parse JSON string to DTO
            FishAdsRequestDTO fishAdsRequestDTO = objectMapper.readValue(fishAdsRequestJson, FishAdsRequestDTO.class);

            // Set images
            fishAdsRequestDTO.setImages(images);

            // Get userId from JWT token claims
            Long userId = getCurrentUserId(request);
            System.out.println("Extracted userId from JWT token: " + userId);
            fishAdsRequestDTO.setUserId(userId);

            Fish savedFish = fishService.saveFishAd(fishAdsRequestDTO);
            // Updated to use user instead of userProfile
            System.out.println("Saved fish ad with userId: " + savedFish.getUser().getId());
            return new ResponseEntity<>(savedFish, HttpStatus.CREATED);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing request: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request data: " + e.getMessage());
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
}