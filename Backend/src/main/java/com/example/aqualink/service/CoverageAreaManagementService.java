package com.example.aqualink.service;

import com.example.aqualink.dto.CoverageAreaManagementDTO;
import com.example.aqualink.dto.UpdateCoverageAreaDTO;
import com.example.aqualink.entity.DeliveryPersonAvailability;
import com.example.aqualink.entity.DeliveryPersonCoverage;
import com.example.aqualink.entity.User;
import com.example.aqualink.repository.DeliveryPersonAvailabilityRepository;
import com.example.aqualink.repository.DeliveryPersonCoverageRepository;
import com.example.aqualink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CoverageAreaManagementService {

    private final DeliveryPersonAvailabilityRepository availabilityRepository;
    private final DeliveryPersonCoverageRepository coverageRepository;
    private final UserRepository userRepository;

    /**
     * Get coverage area and availability data for a delivery person
     */
    public CoverageAreaManagementDTO getCoverageAreaData(String deliveryPersonEmail) {
        try {
            System.out.println("CoverageAreaManagementService: Getting data for email: " + deliveryPersonEmail);
            
            User deliveryPerson = userRepository.findByEmail(deliveryPersonEmail)
                .orElseThrow(() -> new RuntimeException("Delivery person not found"));

            System.out.println("Found delivery person: " + deliveryPerson.getId());

            // Get availability data
            Optional<DeliveryPersonAvailability> availabilityOpt = 
                availabilityRepository.findByDeliveryPersonUser(deliveryPerson);

            // Get coverage data (towns)
            List<DeliveryPersonCoverage> coverageList = 
                coverageRepository.findByDeliveryPersonUser(deliveryPerson);

            if (availabilityOpt.isPresent() || !coverageList.isEmpty()) {
                System.out.println("Found existing availability or coverage records");
                DeliveryPersonAvailability availability = availabilityOpt.orElse(null);
                return convertToDTO(availability, coverageList);
            } else {
                System.out.println("No existing availability or coverage records, returning defaults");
                // Return default data if no records exist
                CoverageAreaManagementDTO defaultData = new CoverageAreaManagementDTO();
                defaultData.setIsAvailable(true);
                defaultData.setSelectedDistricts(new ArrayList<>());
                defaultData.setSelectedTowns(new HashMap<>());
                defaultData.setLastUpdated(LocalDateTime.now());
                return defaultData;
            }
        } catch (Exception e) {
            System.err.println("Error in getCoverageAreaData: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Update coverage area and availability data for a delivery person
     */
    public CoverageAreaManagementDTO updateCoverageAreaData(String deliveryPersonEmail, UpdateCoverageAreaDTO updateDTO) {
        User deliveryPerson = userRepository.findByEmail(deliveryPersonEmail)
            .orElseThrow(() -> new RuntimeException("Delivery person not found"));

        // Handle availability
        Optional<DeliveryPersonAvailability> existingAvailability = 
            availabilityRepository.findByDeliveryPersonUser(deliveryPerson);

        DeliveryPersonAvailability availability;
        if (existingAvailability.isPresent()) {
            availability = existingAvailability.get();
        } else {
            availability = new DeliveryPersonAvailability();
            availability.setDeliveryPersonUser(deliveryPerson);
        }

        // Update availability only
        availability.setIsAvailable(updateDTO.getIsAvailable());
        availability.setLastUpdated(LocalDateTime.now());
        DeliveryPersonAvailability savedAvailability = availabilityRepository.save(availability);
        
        // Handle coverage areas in separate entity
        // First, delete existing coverage records for this user
        List<DeliveryPersonCoverage> existingCoverage = coverageRepository.findByDeliveryPersonUser(deliveryPerson);
        if (!existingCoverage.isEmpty()) {
            coverageRepository.deleteAll(existingCoverage);
        }
        
        // Create new coverage record with selected towns
        if (updateDTO.getSelectedTowns() != null && !updateDTO.getSelectedTowns().isEmpty()) {
            List<String> serviceTowns = new ArrayList<>();
            for (Map.Entry<String, List<String>> entry : updateDTO.getSelectedTowns().entrySet()) {
                String district = entry.getKey();
                List<String> towns = entry.getValue();
                for (String town : towns) {
                    serviceTowns.add(district + ":" + town); // Store as "District:Town"
                }
            }
            
            DeliveryPersonCoverage newCoverage = new DeliveryPersonCoverage();
            newCoverage.setDeliveryPersonUser(deliveryPerson);
            newCoverage.setTowns(serviceTowns);
            coverageRepository.save(newCoverage);
        }

        // Return updated data
        List<DeliveryPersonCoverage> updatedCoverage = coverageRepository.findByDeliveryPersonUser(deliveryPerson);
        return convertToDTO(savedAvailability, updatedCoverage);
    }

    /**
     * Update only availability status
     */
    public CoverageAreaManagementDTO updateAvailabilityStatus(String deliveryPersonEmail, Boolean isAvailable) {
        User deliveryPerson = userRepository.findByEmail(deliveryPersonEmail)
            .orElseThrow(() -> new RuntimeException("Delivery person not found"));

        Optional<DeliveryPersonAvailability> existingAvailability = 
            availabilityRepository.findByDeliveryPersonUser(deliveryPerson);

        DeliveryPersonAvailability availability;
        if (existingAvailability.isPresent()) {
            availability = existingAvailability.get();
        } else {
            availability = new DeliveryPersonAvailability();
            availability.setDeliveryPersonUser(deliveryPerson);
        }

        availability.setIsAvailable(isAvailable);
        availability.setLastUpdated(LocalDateTime.now());

        DeliveryPersonAvailability savedAvailability = availabilityRepository.save(availability);
        
        // Get coverage data to return complete information
        List<DeliveryPersonCoverage> coverageList = coverageRepository.findByDeliveryPersonUser(deliveryPerson);
        return convertToDTO(savedAvailability, coverageList);
    }

    private CoverageAreaManagementDTO convertToDTO(DeliveryPersonAvailability availability, List<DeliveryPersonCoverage> coverageList) {
        CoverageAreaManagementDTO dto = new CoverageAreaManagementDTO();
        
        // Set availability data
        if (availability != null) {
            dto.setIsAvailable(availability.getIsAvailable());
            dto.setLastUpdated(availability.getLastUpdated());
        } else {
            dto.setIsAvailable(true); // Default availability
            dto.setLastUpdated(LocalDateTime.now());
        }
        
        // Set coverage towns from DeliveryPersonCoverage entities
        Map<String, List<String>> selectedTowns = new HashMap<>();
        Set<String> selectedDistricts = new HashSet<>();
        
        for (DeliveryPersonCoverage coverage : coverageList) {
            if (coverage.getTowns() != null) {
                for (String serviceTown : coverage.getTowns()) {
                    if (serviceTown.contains(":")) {
                        String[] parts = serviceTown.split(":", 2);
                        String district = parts[0];
                        String town = parts[1];
                        
                        selectedDistricts.add(district);
                        selectedTowns.computeIfAbsent(district, k -> new ArrayList<>()).add(town);
                    }
                }
            }
        }
        
        dto.setSelectedDistricts(new ArrayList<>(selectedDistricts));
        dto.setSelectedTowns(selectedTowns);
        
        return dto;
    }

    private CoverageAreaManagementDTO convertToDTO(DeliveryPersonAvailability availability) {
        CoverageAreaManagementDTO dto = new CoverageAreaManagementDTO();
        dto.setIsAvailable(availability.getIsAvailable());
        dto.setLastUpdated(availability.getLastUpdated());

        // Convert flat service towns list back to district-town structure
        Map<String, List<String>> selectedTowns = new HashMap<>();
        Set<String> selectedDistricts = new HashSet<>();

        if (availability.getServiceTowns() != null) {
            for (String serviceTown : availability.getServiceTowns()) {
                if (serviceTown.contains(":")) {
                    String[] parts = serviceTown.split(":", 2);
                    String district = parts[0];
                    String town = parts[1];
                    
                    selectedDistricts.add(district);
                    selectedTowns.computeIfAbsent(district, k -> new ArrayList<>()).add(town);
                }
            }
        }

        dto.setSelectedDistricts(new ArrayList<>(selectedDistricts));
        dto.setSelectedTowns(selectedTowns);

        return dto;
    }
}