package com.example.aqualink.controller;

import com.example.aqualink.dto.FishAdsRequestDTO;
import com.example.aqualink.entity.Fish;
import com.example.aqualink.service.FishService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/fish-ads")
@CrossOrigin(origins = "http://localhost:5173")
public class FishAdsController {

    private final FishService fishService;
    private final ObjectMapper objectMapper;

    public FishAdsController(FishService fishService, ObjectMapper objectMapper) {
        this.fishService = fishService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createFishAd(
            @RequestPart("fishAdsRequest") String fishAdsRequestJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {

        try {
            // Parse JSON string to DTO
            FishAdsRequestDTO fishAdsRequestDTO = objectMapper.readValue(fishAdsRequestJson, FishAdsRequestDTO.class);

            // Set images
            fishAdsRequestDTO.setImages(images);

            Fish savedFish = fishService.saveFishAd(fishAdsRequestDTO);
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
}