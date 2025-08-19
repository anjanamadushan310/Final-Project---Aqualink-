package com.example.aqualink.service;

import com.example.aqualink.entity.Banner;

import java.util.List;

public interface BannerService {
    List<Banner> getAllBanners();
    Banner addBanner(Banner banner);
}

