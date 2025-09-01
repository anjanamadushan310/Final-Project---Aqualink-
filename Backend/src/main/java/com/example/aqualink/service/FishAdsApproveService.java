package com.example.aqualink.service;


import com.example.aqualink.entity.Fish;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.repository.FishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FishAdsApproveService {

    @Autowired
    private FishRepository fishRepository;

    public List<Fish> getAllFish() {
        return fishRepository.findAllByOrderByCreateDateAndTimeDesc();
    }

    public List<Fish> getFishByStatus(ActiveStatus status) {
        return fishRepository.findByActiveStatus(status);
    }

    public Optional<Fish> getFishById(Long id) {
        return fishRepository.findById(id);
    }

    public Fish updateFishStatus(Long id, ActiveStatus status) {
        Fish fish = fishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fish not found with id: " + id));
        fish.setActiveStatus(status);
        return fishRepository.save(fish);
    }

    public void deleteFish(Long id) {
        fishRepository.deleteById(id);
    }
}

