package com.example.aqualink.controller;

import com.example.aqualink.entity.Banner;
import com.example.aqualink.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "http://localhost:5173")
public class BannerController {
    @Autowired
    private BannerService bannerService;

    @GetMapping
    public List<Banner> getBanners() {
        return bannerService.getAllBanners();
    }

    @PostMapping
    public Banner createBanner(@RequestBody Banner banner) {
        return bannerService.addBanner(banner);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadBanner(@RequestParam("bannerImage") MultipartFile file) {
        try {
            Banner banner = bannerService.uploadBanner(file);
            return ResponseEntity.ok(banner);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading banner: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        try {
            bannerService.deleteBanner(id);
            return ResponseEntity.ok("Banner deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting banner: " + e.getMessage());
        }
    }
}
