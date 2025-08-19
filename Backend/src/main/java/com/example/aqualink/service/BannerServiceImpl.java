package com.example.aqualink.service;

import com.example.aqualink.entity.Banner;
import com.example.aqualink.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerRepository bannerRepo;

    @Override
    public List<Banner> getAllBanners() {
        return bannerRepo.findAll();
    }

    @Override
    public Banner addBanner(Banner banner) {
        return bannerRepo.save(banner);
    }
}

