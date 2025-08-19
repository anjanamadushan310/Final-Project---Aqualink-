package com.example.aqualink.controller;

import com.example.aqualink.entity.Banner;
import com.example.aqualink.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "*") // Adjust for security in real deployment
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
}

