package com.example.aqualink.controller;

import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.aqualink.dto.IndustrialStuffRequestDTO;
import com.example.aqualink.entity.IndustrialStuff;
import com.example.aqualink.service.IndustrialStuffCreateService;
import com.example.aqualink.security.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/industrial-ads")
public class IndustrialStuffCreateController {

    private final IndustrialStuffCreateService industrialService;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    public IndustrialStuffCreateController(IndustrialStuffCreateService industrialService,
                                           ObjectMapper objectMapper, JwtUtil jwtUtil) {
        this.industrialService = industrialService;
        this.objectMapper = objectMapper;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Object> createIndustrialAd(
            HttpServletRequest request,
            @RequestPart("industrialRequest") String industrialRequestJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {
        try {
            IndustrialStuffRequestDTO industrialRequestDTO = objectMapper.readValue(industrialRequestJson, IndustrialStuffRequestDTO.class);
            industrialRequestDTO.setImages(images);

            Long userId = getCurrentUserId(request);
            industrialRequestDTO.setUserId(userId);

            IndustrialStuff savedIndustrial = industrialService.saveIndustrialAd(industrialRequestDTO);
            return new ResponseEntity<>(savedIndustrial, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request data: " + e.getMessage());
        }
    }

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
            // Log error
        }
        return null;
    }
}
