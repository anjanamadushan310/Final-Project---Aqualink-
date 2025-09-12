package com.example.aqualink.controller;

import com.example.aqualink.entity.Service;
import com.example.aqualink.security.util.JwtUtil;
import com.example.aqualink.service.ServiceService;
import com.example.aqualink.dto.ApprovalRequest;
import com.example.aqualink.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/admin/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminServiceController {

    private final ServiceService serviceService;
    private final JwtUtil jwtUtils;

    @GetMapping("/pending")
    public ResponseEntity<Page<Service>> getPendingApprovals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Service> services = serviceService.getPendingApprovals(pageable);
        return ResponseEntity.ok(services);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Service> approveService(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        Long adminId = getCurrentUserId(httpRequest);
        Service service = serviceService.approveService(id, adminId);
        return ResponseEntity.ok(service);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Service> rejectService(
            @PathVariable Long id,
            @RequestBody ApprovalRequest request,
            HttpServletRequest httpRequest) {

        Long adminId = getCurrentUserId(httpRequest);
        Service service = serviceService.rejectService(id, request.getReason(), adminId);
        return ResponseEntity.ok(service);
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = jwtUtils.getJwtFromRequest(request);
        return jwtUtils.getUserIdFromToken(token);
    }
}
