package com.example.aqualink.controller;

import com.example.aqualink.dto.FishAdsResponseDTO;
import com.example.aqualink.dto.FishPurchaseDTO;
import com.example.aqualink.service.FishAdsViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fish")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FishAdsViewController {

    private final FishAdsViewService fishAddService;

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

    @PostMapping("/purchase")
    public ResponseEntity<String> purchaseFish(@RequestBody FishPurchaseDTO purchaseDTO) {
        boolean success = fishAddService.processPurchase(purchaseDTO);

        if (success) {
            return ResponseEntity.ok("Purchase successful!");
        } else {
            return ResponseEntity.badRequest().body("Purchase failed. Check stock availability.");
        }
    }
}

