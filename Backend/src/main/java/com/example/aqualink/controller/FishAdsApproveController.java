package com.example.aqualink.controller;

import com.example.aqualink.entity.Fish;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.service.FishAdsApproveService;
import com.example.aqualink.dto.FishAdsStatusDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/fish")
@CrossOrigin(origins = {"http://localhost:5173"})
public class FishAdsApproveController {

    @Autowired
    private FishAdsApproveService approveFishService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFish() {
        List<Fish> fishList = approveFishService.getAllFish();
        List<Map<String, Object>> response = fishList.stream()
                .map(this::mapFishToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Map<String, Object>>> getFishByStatus(@PathVariable String status) {
        try {
            ActiveStatus activeStatus = ActiveStatus.valueOf(status.toUpperCase());
            List<Fish> fishList = approveFishService.getFishByStatus(activeStatus);
            List<Map<String, Object>> response = fishList.stream()
                    .map(this::mapFishToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getFishById(@PathVariable Long id) {
        return approveFishService.getFishById(id)
                .map(fish -> ResponseEntity.ok().body(mapFishToResponse(fish)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateFishStatus(@PathVariable Long id, @RequestBody FishAdsStatusDto statusDto) {
        try {
            ActiveStatus status = ActiveStatus.valueOf(statusDto.getActiveStatus().toUpperCase());
            Fish updatedFish = approveFishService.updateFishStatus(id, status);
            return ResponseEntity.ok(mapFishToResponse(updatedFish));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteFish(@PathVariable Long id) {
        try {
            approveFishService.deleteFish(id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", Boolean.TRUE);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getFishStats() {
        List<Fish> allFish = approveFishService.getAllFish();
        Map<String, Long> stats = new HashMap<>();

        stats.put("total", (long) allFish.size());
        stats.put("pending", allFish.stream().filter(f -> f.getActiveStatus() == ActiveStatus.PENDING).count());
        stats.put("verified", allFish.stream().filter(f -> f.getActiveStatus() == ActiveStatus.VERIFIED).count());
        stats.put("rejected", allFish.stream().filter(f -> f.getActiveStatus() == ActiveStatus.REJECTED).count());

        return ResponseEntity.ok(stats);
    }

    // Helper method to map Fish entity to response with image URLs
    private Map<String, Object> mapFishToResponse(Fish fish) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", fish.getId());
        response.put("name", fish.getName());
        response.put("description", fish.getDescription());
        response.put("nicNumber", fish.getNicNumber());
        response.put("stock", fish.getStock());
        response.put("price", fish.getPrice());
        response.put("minimumQuantity", fish.getMinimumQuantity());
        response.put("createDateAndTime", fish.getCreateDateAndTime());
        response.put("activeStatus", fish.getActiveStatus());

        // Convert image paths to full URLs
        List<String> imageUrls = fish.getImagePaths() != null ?
                fish.getImagePaths().stream()
                        .map(imagePath -> baseUrl  + imagePath)
                        .collect(Collectors.toList()) :
                List.of();

        response.put("imageUrls", imageUrls);
        response.put("imagePaths", fish.getImagePaths()); // Keep original paths for reference

        return response;
    }
}

