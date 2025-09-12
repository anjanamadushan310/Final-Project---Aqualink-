package com.example.aqualink.controller;

import com.example.aqualink.dto.IndustrialStuffResponseDTO;
import com.example.aqualink.dto.IndustrialStuffPurchaseDTO;
import com.example.aqualink.service.IndustrialStuffViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/industrial")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class IndustrialStuffViewController {

    private final IndustrialStuffViewService industrialService;

    @GetMapping
    public ResponseEntity<List<IndustrialStuffResponseDTO>> getAllIndustrial() {
        List<IndustrialStuffResponseDTO> industrialList = industrialService.getAllAvailableIndustrial();
        return ResponseEntity.ok(industrialList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndustrialStuffResponseDTO> getIndustrialById(@PathVariable Long id) {
        Optional<IndustrialStuffResponseDTO> industrial = industrialService.getIndustrialById(id);
        return industrial.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<IndustrialStuffResponseDTO>> searchIndustrial(@RequestParam String q) {
        List<IndustrialStuffResponseDTO> industrialList = industrialService.searchIndustrial(q);
        return ResponseEntity.ok(industrialList);
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<String> purchaseIndustrial(@PathVariable Long id, @RequestBody IndustrialStuffPurchaseDTO purchaseDTO) {
        purchaseDTO.setIndustrialId(id);
        boolean success = industrialService.processPurchase(purchaseDTO);
        if (success) {
            return ResponseEntity.ok("Purchase successful!");
        } else {
            return ResponseEntity.badRequest().body("Purchase failed. Check stock availability.");
        }
    }
}
