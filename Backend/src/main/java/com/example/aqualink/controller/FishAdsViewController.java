package com.example.aqualink.controller;

import com.example.aqualink.dto.FishAdsResponseDTO;
import com.example.aqualink.dto.FishPurchaseDTO;
import com.example.aqualink.service.FishAdsViewService;
import com.example.aqualink.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/fish")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FishAdsViewController {

    private final FishAdsViewService fishAddService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<FishAdsResponseDTO>> getAllFish() {
        List<FishAdsResponseDTO> fishList = fishAddService.getAllAvailableFish();
        return ResponseEntity.ok(fishList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FishAdsResponseDTO> getFishById(@PathVariable Long id) {
        Optional<FishAdsResponseDTO> fish = fishAddService.getFishById(id);
        return fish.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<FishAdsResponseDTO>> searchFish(@RequestParam String q) {
        List<FishAdsResponseDTO> fishList = fishAddService.searchFish(q);
        return ResponseEntity.ok(fishList);
    }

    @GetMapping("/my-approved")
    public ResponseEntity<List<FishAdsResponseDTO>> getMyApprovedFishAds(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        List<FishAdsResponseDTO> fishList = fishAddService.getApprovedFishByUserId(userId);
        return ResponseEntity.ok(fishList);
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateFishStock(
            HttpServletRequest request,
            @PathVariable Long id, 
            @RequestBody Map<String, Integer> stockUpdate) {
        Long userId = getCurrentUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        Integer newStock = stockUpdate.get("stock");
        if (newStock == null || newStock < 0) {
            return ResponseEntity.badRequest().body("Invalid stock value");
        }
        
        boolean success = fishAddService.updateFishStock(id, userId, newStock);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Stock updated successfully"));
        } else {
            return ResponseEntity.status(403).body("Not authorized to update this fish ad or fish ad not found");
        }
    }

    @PostMapping("/purchase")
    public ResponseEntity<String> purchaseFish(@RequestBody FishPurchaseDTO purchaseDTO) {
        boolean success = fishAddService.processPurchase(purchaseDTO);

        if (success) {
            return ResponseEntity.ok("Purchase successful!");
        } else {
            return ResponseEntity.badRequest().body("Purchase failed. Check stock availability.");
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

