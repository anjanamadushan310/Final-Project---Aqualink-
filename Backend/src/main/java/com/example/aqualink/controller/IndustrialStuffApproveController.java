package com.example.aqualink.controller;

import com.example.aqualink.entity.IndustrialStuff;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.service.IndustrialStuffApproveService;
import com.example.aqualink.dto.IndustrialStuffStatusDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/industrial")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class IndustrialStuffApproveController {

    @Autowired
    private IndustrialStuffApproveService approveIndustrialService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllIndustrial() {
        List<IndustrialStuff> industrialList = approveIndustrialService.getAllIndustrial();
        List<Map<String, Object>> response = industrialList.stream()
                .map(this::mapIndustrialToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Map<String, Object>>> getIndustrialByStatus(@PathVariable String status) {
        try {
            ActiveStatus activeStatus = ActiveStatus.valueOf(status.toUpperCase());
            List<IndustrialStuff> industrialList = approveIndustrialService.getIndustrialByStatus(activeStatus);
            List<Map<String, Object>> response = industrialList.stream()
                    .map(this::mapIndustrialToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getIndustrialById(@PathVariable Long id) {
        return approveIndustrialService.getIndustrialById(id)
                .map(industrial -> ResponseEntity.ok().body(mapIndustrialToResponse(industrial)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateIndustrialStatus(@PathVariable Long id, @RequestBody IndustrialStuffStatusDto statusDto) {
        try {
            ActiveStatus status = ActiveStatus.valueOf(statusDto.getActiveStatus().toUpperCase());
            IndustrialStuff updatedIndustrial = approveIndustrialService.updateIndustrialStatus(id, status);
            return ResponseEntity.ok(mapIndustrialToResponse(updatedIndustrial));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteIndustrial(@PathVariable Long id) {
        try {
            approveIndustrialService.deleteIndustrial(id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", Boolean.TRUE);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getIndustrialStats() {
        List<IndustrialStuff> allIndustrial = approveIndustrialService.getAllIndustrial();
        Map<String, Long> stats = new HashMap<>();

        stats.put("total", (long) allIndustrial.size());
        stats.put("pending", allIndustrial.stream().filter(i -> i.getActiveStatus() == ActiveStatus.PENDING).count());
        stats.put("verified", allIndustrial.stream().filter(i -> i.getActiveStatus() == ActiveStatus.VERIFIED).count());
        stats.put("rejected", allIndustrial.stream().filter(i -> i.getActiveStatus() == ActiveStatus.REJECTED).count());

        return ResponseEntity.ok(stats);
    }

    // Helper method to map IndustrialStuff entity to response with image URLs
    private Map<String, Object> mapIndustrialToResponse(IndustrialStuff industrial) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", industrial.getId());
        response.put("name", industrial.getName());
        response.put("description", industrial.getDescription());
        response.put("category", industrial.getCategory());
        response.put("nicNumber", industrial.getNicNumber());
        response.put("stock", industrial.getStock());
        response.put("price", industrial.getPrice());
        response.put("inStock", industrial.getInStock());
        response.put("soldCount", industrial.getSoldCount());
        response.put("createDateAndTime", industrial.getCreateDateAndTime());
        response.put("activeStatus", industrial.getActiveStatus());

        // Add user information if available
        if (industrial.getUser() != null) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", industrial.getUser().getId());
            response.put("user", userInfo);
        }

        // Convert image paths to full URLs
        List<String> imageUrls = industrial.getImagePaths() != null ?
                industrial.getImagePaths().stream()
                        .map(imagePath -> baseUrl + imagePath)
                        .collect(Collectors.toList()) :
                List.of();

        response.put("imageUrls", imageUrls);
        response.put("imagePaths", industrial.getImagePaths()); // Keep original paths for reference

        return response;
    }
}
