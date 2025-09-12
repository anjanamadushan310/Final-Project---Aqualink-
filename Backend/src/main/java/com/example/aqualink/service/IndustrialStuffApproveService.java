package com.example.aqualink.service;

import com.example.aqualink.entity.IndustrialStuff;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.repository.IndustrialStuffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IndustrialStuffApproveService {

    @Autowired
    private IndustrialStuffRepository industrialStuffRepository;

    public List<IndustrialStuff> getAllIndustrial() {
        return industrialStuffRepository.findAllByOrderByCreateDateAndTimeDesc();
    }

    public List<IndustrialStuff> getIndustrialByStatus(ActiveStatus status) {
        return industrialStuffRepository.findByActiveStatus(status);
    }

    public Optional<IndustrialStuff> getIndustrialById(Long id) {
        return industrialStuffRepository.findById(id);
    }

    public IndustrialStuff updateIndustrialStatus(Long id, ActiveStatus status) {
        IndustrialStuff industrial = industrialStuffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Industrial item not found with id: " + id));
        industrial.setActiveStatus(status);
        return industrialStuffRepository.save(industrial);
    }

    public void deleteIndustrial(Long id) {
        industrialStuffRepository.deleteById(id);
    }
}
