package com.example.aqualink.service;

import com.example.aqualink.entity.Banner;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface BannerService {
    List<Banner> getAllBanners();
    Banner addBanner(Banner banner);
    Banner uploadBanner(MultipartFile file);
    void deleteBanner(Long id);
}
