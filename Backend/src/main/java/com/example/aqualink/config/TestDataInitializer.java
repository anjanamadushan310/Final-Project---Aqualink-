package com.example.aqualink.config;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.entity.DeliveryPersonCoverage;
import com.example.aqualink.entity.Fish;
import com.example.aqualink.entity.IndustrialStuff;
import com.example.aqualink.entity.Role;
import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserProfile;
import com.example.aqualink.entity.UserRole;
import com.example.aqualink.entity.VerificationStatus;
import com.example.aqualink.repository.DeliveryPersonCoverageRepository;
import com.example.aqualink.repository.FishRepository;
import com.example.aqualink.repository.IndustrialStuffRepository;
import com.example.aqualink.repository.UserProfileRepository;
import com.example.aqualink.repository.UserRepository;
import com.example.aqualink.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * TEMPORARY TEST DATA INITIALIZER
 * This class is for testing purposes only and should be deleted after testing.
 * It creates test users, fish ads, and delivery coverage data.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TestDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserProfileRepository userProfileRepository;
    private final FishRepository fishRepository;
    private final IndustrialStuffRepository industrialStuffRepository;
    private final DeliveryPersonCoverageRepository coverageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("=== INITIALIZING TEST DATA ===");
        
        try {
            // Check if database connection is working
            long userCount = userRepository.count();
            log.info("Current user count in database: " + userCount);
            
            // Force test data creation (for debugging)
            boolean testUserExists = userRepository.existsByEmail("test1@gmail.com");
            log.info("Test user exists: " + testUserExists);
            
            if (!testUserExists) {
                log.info("Creating test data...");
                createTestUsers();
                createAdditionalTestUsers();
                createMultiRoleUsers();
                createTestFishAds();
                createMoreFishAds();
                createIndustrialStuffAds();
                log.info("=== TEST DATA INITIALIZATION COMPLETE ===");
                
                // Verify data was created
                long finalUserCount = userRepository.count();
                log.info("Final user count in database: " + finalUserCount);
            } else {
                log.info("Test data already exists, skipping initialization");
                log.info("If you want to recreate test data, delete the database or change the test email");
            }
        } catch (Exception e) {
            log.error("Error during test data initialization: " + e.getMessage(), e);
            throw e;
        }
    }

    private void createTestUsers() {
        log.info("Creating test users...");

        try {
            // Create test delivery person
            log.info("Creating delivery person...");
            User deliveryPerson = new User();
        deliveryPerson.setNicNumber("123456789V");
        deliveryPerson.setName("Test Delivery Person");
        deliveryPerson.setEmail("test1@gmail.com");
        deliveryPerson.setPhoneNumber("+94771234567");
        deliveryPerson.setPassword(passwordEncoder.encode("ASd236asd@"));
        deliveryPerson.setActive(true);
        deliveryPerson.setVerificationStatus(VerificationStatus.APPROVED);
        deliveryPerson.setCreatedAt(LocalDateTime.now());
        
        User savedDeliveryPerson = userRepository.save(deliveryPerson);
        log.info("Delivery person created with ID: " + savedDeliveryPerson.getId() + ", Email: " + savedDeliveryPerson.getEmail());

        // Assign DELIVERY_PERSON role
        UserRole userRole = new UserRole();
        userRole.setUser(savedDeliveryPerson);
        userRole.setRoleName(Role.DELIVERY_PERSON);
        userRoleRepository.save(userRole);
        log.info("DELIVERY_PERSON role assigned to user: " + savedDeliveryPerson.getEmail());

        // Create profile for delivery person
        UserProfile deliveryProfile = new UserProfile();
        deliveryProfile.setUser(savedDeliveryPerson);
        deliveryProfile.setBusinessName("Test Delivery Services");
        deliveryProfile.setBusinessType("Logistics");
        deliveryProfile.setAddressPlace("Main Office");
        deliveryProfile.setAddressStreet("Test Street 123");
        deliveryProfile.setAddressDistrict("Colombo");
        deliveryProfile.setAddressTown("Colombo 01");
        deliveryProfile.setCreatedAt(LocalDateTime.now());
        deliveryProfile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(deliveryProfile);

        // Create coverage areas for delivery person (Colombo and Gampaha districts)
        createCoverageArea(savedDeliveryPerson, Arrays.asList(
            "Colombo 01", "Colombo 02", "Colombo 03", "Colombo 04", "Colombo 05",
            "Colombo 06", "Colombo 07", "Colombo 08", "Colombo 09", "Colombo 10",
            "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15"
        ));
        
        createCoverageArea(savedDeliveryPerson, Arrays.asList(
            "Gampaha", "Negombo", "Kelaniya", "Wattala", "Ja-Ela", "Kandana"
        ));

        // Create test shop owner for fish ads
        User shopOwner = new User();
        shopOwner.setNicNumber("987654321V");
        shopOwner.setName("Test Shop Owner");
        shopOwner.setEmail("testshop@gmail.com");
        shopOwner.setPhoneNumber("+94777654321");
        shopOwner.setPassword(passwordEncoder.encode("ASd236asd@"));
        shopOwner.setActive(true);
        shopOwner.setVerificationStatus(VerificationStatus.APPROVED);
        shopOwner.setCreatedAt(LocalDateTime.now());
        
        User savedShopOwner = userRepository.save(shopOwner);

        // Assign SHOP_OWNER role
        UserRole shopUserRole = new UserRole();
        shopUserRole.setUser(savedShopOwner);
        shopUserRole.setRoleName(Role.SHOP_OWNER);
        userRoleRepository.save(shopUserRole);

        // Create profile for shop owner
        UserProfile shopProfile = new UserProfile();
        shopProfile.setUser(savedShopOwner);
        shopProfile.setBusinessName("Test Fish Market");
        shopProfile.setBusinessType("Fish Retail");
        shopProfile.setAddressPlace("Fish Market Building");
        shopProfile.setAddressStreet("Harbor Street 456");
        shopProfile.setAddressDistrict("Colombo");
        shopProfile.setAddressTown("Colombo 02");
        shopProfile.setCreatedAt(LocalDateTime.now());
        shopProfile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(shopProfile);

            log.info("Test users created successfully");
        } catch (Exception e) {
            log.error("Error creating test users: " + e.getMessage(), e);
            throw e;
        }
    }

    private void createAdditionalTestUsers() {
        log.info("Creating additional test users...");

        // Create test delivery person 2 (covers different areas)
        User deliveryPerson2 = new User();
        deliveryPerson2.setNicNumber("111222333V");
        deliveryPerson2.setName("Test Delivery Person 2");
        deliveryPerson2.setEmail("test2@gmail.com");
        deliveryPerson2.setPhoneNumber("+94712345678");
        deliveryPerson2.setPassword(passwordEncoder.encode("ASd236asd@"));
        deliveryPerson2.setActive(true);
        deliveryPerson2.setVerificationStatus(VerificationStatus.APPROVED);
        deliveryPerson2.setCreatedAt(LocalDateTime.now());
        
        User savedDeliveryPerson2 = userRepository.save(deliveryPerson2);

        // Assign DELIVERY_PERSON role
        UserRole userRole2 = new UserRole();
        userRole2.setUser(savedDeliveryPerson2);
        userRole2.setRoleName(Role.DELIVERY_PERSON);
        userRoleRepository.save(userRole2);

        // Create profile for delivery person 2
        UserProfile deliveryProfile2 = new UserProfile();
        deliveryProfile2.setUser(savedDeliveryPerson2);
        deliveryProfile2.setBusinessName("Express Delivery Co");
        deliveryProfile2.setBusinessType("Express Logistics");
        deliveryProfile2.setAddressPlace("Delivery Center");
        deliveryProfile2.setAddressStreet("Main Road 789");
        deliveryProfile2.setAddressDistrict("Kandy");
        deliveryProfile2.setAddressTown("Kandy");
        deliveryProfile2.setCreatedAt(LocalDateTime.now());
        deliveryProfile2.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(deliveryProfile2);

        // Create coverage areas for delivery person 2 (Kandy and Matale districts)
        createCoverageArea(savedDeliveryPerson2, Arrays.asList(
            "Kandy", "Peradeniya", "Gampola", "Nawalapitiya", "Kadugannawa"
        ));
        
        createCoverageArea(savedDeliveryPerson2, Arrays.asList(
            "Matale", "Dambulla", "Sigiriya", "Galewela"
        ));

        // Create test farm owner
        User farmOwner = new User();
        farmOwner.setNicNumber("444555666V");
        farmOwner.setName("Test Farm Owner");
        farmOwner.setEmail("testfarm@gmail.com");
        farmOwner.setPhoneNumber("+94723456789");
        farmOwner.setPassword(passwordEncoder.encode("ASd236asd@"));
        farmOwner.setActive(true);
        farmOwner.setVerificationStatus(VerificationStatus.APPROVED);
        farmOwner.setCreatedAt(LocalDateTime.now());
        
        User savedFarmOwner = userRepository.save(farmOwner);

        // Assign FARM_OWNER role
        UserRole farmUserRole = new UserRole();
        farmUserRole.setUser(savedFarmOwner);
        farmUserRole.setRoleName(Role.FARM_OWNER);
        userRoleRepository.save(farmUserRole);

        // Create profile for farm owner
        UserProfile farmProfile = new UserProfile();
        farmProfile.setUser(savedFarmOwner);
        farmProfile.setBusinessName("Aqua Fish Farm");
        farmProfile.setBusinessType("Fish Farming");
        farmProfile.setAddressPlace("Farm House");
        farmProfile.setAddressStreet("Lake Side Road 101");
        farmProfile.setAddressDistrict("Kurunegala");
        farmProfile.setAddressTown("Kurunegala");
        farmProfile.setCreatedAt(LocalDateTime.now());
        farmProfile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(farmProfile);

        // Create test industrial stuff seller
        User industrialSeller = new User();
        industrialSeller.setNicNumber("777888999V");
        industrialSeller.setName("Test Industrial Seller");
        industrialSeller.setEmail("testindustrial@gmail.com");
        industrialSeller.setPhoneNumber("+94734567890");
        industrialSeller.setPassword(passwordEncoder.encode("ASd236asd@"));
        industrialSeller.setActive(true);
        industrialSeller.setVerificationStatus(VerificationStatus.APPROVED);
        industrialSeller.setCreatedAt(LocalDateTime.now());
        
        User savedIndustrialSeller = userRepository.save(industrialSeller);

        // Assign INDUSTRIAL_STUFF_SELLER role
        UserRole industrialUserRole = new UserRole();
        industrialUserRole.setUser(savedIndustrialSeller);
        industrialUserRole.setRoleName(Role.INDUSTRIAL_STUFF_SELLER);
        userRoleRepository.save(industrialUserRole);

        // Create profile for industrial seller
        UserProfile industrialProfile = new UserProfile();
        industrialProfile.setUser(savedIndustrialSeller);
        industrialProfile.setBusinessName("AquaTech Equipment");
        industrialProfile.setBusinessType("Industrial Equipment");
        industrialProfile.setAddressPlace("Industrial Complex");
        industrialProfile.setAddressStreet("Industrial Road 55");
        industrialProfile.setAddressDistrict("Gampaha");
        industrialProfile.setAddressTown("Wattala");
        industrialProfile.setCreatedAt(LocalDateTime.now());
        industrialProfile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(industrialProfile);

        // Create test service provider
        User serviceProvider = new User();
        serviceProvider.setNicNumber("321654987V");
        serviceProvider.setName("Test Service Provider");
        serviceProvider.setEmail("testservice@gmail.com");
        serviceProvider.setPhoneNumber("+94745678901");
        serviceProvider.setPassword(passwordEncoder.encode("ASd236asd@"));
        serviceProvider.setActive(true);
        serviceProvider.setVerificationStatus(VerificationStatus.APPROVED);
        serviceProvider.setCreatedAt(LocalDateTime.now());
        
        User savedServiceProvider = userRepository.save(serviceProvider);

        // Assign SERVICE_PROVIDER role
        UserRole serviceUserRole = new UserRole();
        serviceUserRole.setUser(savedServiceProvider);
        serviceUserRole.setRoleName(Role.SERVICE_PROVIDER);
        userRoleRepository.save(serviceUserRole);

        // Create profile for service provider
        UserProfile serviceProfile = new UserProfile();
        serviceProfile.setUser(savedServiceProvider);
        serviceProfile.setBusinessName("AquaCare Services");
        serviceProfile.setBusinessType("Aquaculture Services");
        serviceProfile.setAddressPlace("Service Center");
        serviceProfile.setAddressStreet("Service Lane 25");
        serviceProfile.setAddressDistrict("Colombo");
        serviceProfile.setAddressTown("Colombo 05");
        serviceProfile.setCreatedAt(LocalDateTime.now());
        serviceProfile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(serviceProfile);

        // Create another shop owner with different location
        User shopOwner2 = new User();
        shopOwner2.setNicNumber("159357486V");
        shopOwner2.setName("Test Shop Owner 2");
        shopOwner2.setEmail("testshop2@gmail.com");
        shopOwner2.setPhoneNumber("+94756789012");
        shopOwner2.setPassword(passwordEncoder.encode("ASd236asd@"));
        shopOwner2.setActive(true);
        shopOwner2.setVerificationStatus(VerificationStatus.APPROVED);
        shopOwner2.setCreatedAt(LocalDateTime.now());
        
        User savedShopOwner2 = userRepository.save(shopOwner2);

        // Assign SHOP_OWNER role
        UserRole shopUserRole2 = new UserRole();
        shopUserRole2.setUser(savedShopOwner2);
        shopUserRole2.setRoleName(Role.SHOP_OWNER);
        userRoleRepository.save(shopUserRole2);

        // Create profile for shop owner 2
        UserProfile shopProfile2 = new UserProfile();
        shopProfile2.setUser(savedShopOwner2);
        shopProfile2.setBusinessName("Sea Fresh Market");
        shopProfile2.setBusinessType("Seafood Retail");
        shopProfile2.setAddressPlace("Market Complex");
        shopProfile2.setAddressStreet("Seaside Avenue 88");
        shopProfile2.setAddressDistrict("Galle");
        shopProfile2.setAddressTown("Galle");
        shopProfile2.setCreatedAt(LocalDateTime.now());
        shopProfile2.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(shopProfile2);

        // Create test exporter
        User exporter = new User();
        exporter.setNicNumber("654321987V");
        exporter.setName("Test Exporter");
        exporter.setEmail("testexporter@gmail.com");
        exporter.setPhoneNumber("+94756123456");
        exporter.setPassword(passwordEncoder.encode("ASd236asd@"));
        exporter.setActive(true);
        exporter.setVerificationStatus(VerificationStatus.APPROVED);
        exporter.setCreatedAt(LocalDateTime.now());
        
        User savedExporter = userRepository.save(exporter);

        // Assign EXPORTER role
        UserRole exporterUserRole = new UserRole();
        exporterUserRole.setUser(savedExporter);
        exporterUserRole.setRoleName(Role.EXPORTER);
        userRoleRepository.save(exporterUserRole);

        // Create profile for exporter
        UserProfile exporterProfile = new UserProfile();
        exporterProfile.setUser(savedExporter);
        exporterProfile.setBusinessName("Global Fish Exports");
        exporterProfile.setBusinessType("Seafood Export");
        exporterProfile.setAddressPlace("Export Processing Center");
        exporterProfile.setAddressStreet("Export Hub Lane 77");
        exporterProfile.setAddressDistrict("Colombo");
        exporterProfile.setAddressTown("Colombo 15");
        exporterProfile.setCreatedAt(LocalDateTime.now());
        exporterProfile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(exporterProfile);

        log.info("Additional test users created successfully");
    }

    private void createCoverageArea(User deliveryPerson, List<String> towns) {
        DeliveryPersonCoverage coverage = new DeliveryPersonCoverage();
        coverage.setDeliveryPersonUser(deliveryPerson);
        coverage.setTowns(towns);
        coverageRepository.save(coverage);
    }

    private void createTestFishAds() {
        log.info("Creating test fish ads...");

        User shopOwner = userRepository.findByEmail("testshop@gmail.com")
                .orElseThrow(() -> new RuntimeException("Test shop owner not found"));

        // Create Test Fish Ad 1
        Fish fishAd1 = new Fish();
        fishAd1.setName("Fresh Tuna Fish");
        fishAd1.setDescription("Premium quality fresh tuna fish caught daily. Perfect for sashimi and grilling. Rich in omega-3 fatty acids and protein.");
        fishAd1.setPrice(2500.00);
        fishAd1.setStock(50);
        fishAd1.setMinimumQuantity(1);
        fishAd1.setNicNumber(shopOwner.getNicNumber());
        fishAd1.setActiveStatus(ActiveStatus.VERIFIED);
        fishAd1.setUser(shopOwner);
        
        fishRepository.save(fishAd1);

        // Create Test Fish Ad 2  
        Fish fishAd2 = new Fish();
        fishAd2.setName("Golden Pomfret");
        fishAd2.setDescription("High-quality golden pomfret fish, ideal for curry and frying. Fresh catch from deep sea waters with excellent taste and texture.");
        fishAd2.setPrice(1800.00);
        fishAd2.setStock(30);
        fishAd2.setMinimumQuantity(1);
        fishAd2.setNicNumber(shopOwner.getNicNumber());
        fishAd2.setActiveStatus(ActiveStatus.VERIFIED);
        fishAd2.setUser(shopOwner);
        
        fishRepository.save(fishAd2);

        log.info("Test fish ads created successfully");
    }

    private void createMultiRoleUsers() {
        log.info("Creating multi-role test users...");

        // Create user with multiple roles (Shop Owner + Farm Owner)
        User multiRole1 = new User();
        multiRole1.setNicNumber("555666777V");
        multiRole1.setName("Multi Role User 1");
        multiRole1.setEmail("multirole1@gmail.com");
        multiRole1.setPhoneNumber("+94767890123");
        multiRole1.setPassword(passwordEncoder.encode("ASd236asd@"));
        multiRole1.setActive(true);
        multiRole1.setVerificationStatus(VerificationStatus.APPROVED);
        multiRole1.setCreatedAt(LocalDateTime.now());
        
        User savedMultiRole1 = userRepository.save(multiRole1);

        // Assign SHOP_OWNER role
        UserRole shopRole1 = new UserRole();
        shopRole1.setUser(savedMultiRole1);
        shopRole1.setRoleName(Role.SHOP_OWNER);
        userRoleRepository.save(shopRole1);

        // Assign FARM_OWNER role
        UserRole farmRole1 = new UserRole();
        farmRole1.setUser(savedMultiRole1);
        farmRole1.setRoleName(Role.FARM_OWNER);
        userRoleRepository.save(farmRole1);

        // Create profile for multi-role user 1
        UserProfile multiProfile1 = new UserProfile();
        multiProfile1.setUser(savedMultiRole1);
        multiProfile1.setBusinessName("Multi Business Ventures");
        multiProfile1.setBusinessType("Fish Shop & Farm");
        multiProfile1.setAddressPlace("Business Complex");
        multiProfile1.setAddressStreet("Commercial Street 200");
        multiProfile1.setAddressDistrict("Colombo");
        multiProfile1.setAddressTown("Colombo 03");
        multiProfile1.setCreatedAt(LocalDateTime.now());
        multiProfile1.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(multiProfile1);

        // Create user with multiple roles (Industrial Seller + Service Provider)
        User multiRole2 = new User();
        multiRole2.setNicNumber("888999000V");
        multiRole2.setName("Multi Role User 2");
        multiRole2.setEmail("multirole2@gmail.com");
        multiRole2.setPhoneNumber("+94778901234");
        multiRole2.setPassword(passwordEncoder.encode("ASd236asd@"));
        multiRole2.setActive(true);
        multiRole2.setVerificationStatus(VerificationStatus.APPROVED);
        multiRole2.setCreatedAt(LocalDateTime.now());
        
        User savedMultiRole2 = userRepository.save(multiRole2);

        // Assign INDUSTRIAL_STUFF_SELLER role
        UserRole industrialRole2 = new UserRole();
        industrialRole2.setUser(savedMultiRole2);
        industrialRole2.setRoleName(Role.INDUSTRIAL_STUFF_SELLER);
        userRoleRepository.save(industrialRole2);

        // Assign SERVICE_PROVIDER role
        UserRole serviceRole2 = new UserRole();
        serviceRole2.setUser(savedMultiRole2);
        serviceRole2.setRoleName(Role.SERVICE_PROVIDER);
        userRoleRepository.save(serviceRole2);

        // Create profile for multi-role user 2
        UserProfile multiProfile2 = new UserProfile();
        multiProfile2.setUser(savedMultiRole2);
        multiProfile2.setBusinessName("Tech & Service Solutions");
        multiProfile2.setBusinessType("Equipment & Services");
        multiProfile2.setAddressPlace("Industrial Park");
        multiProfile2.setAddressStreet("Technology Avenue 150");
        multiProfile2.setAddressDistrict("Gampaha");
        multiProfile2.setAddressTown("Negombo");
        multiProfile2.setCreatedAt(LocalDateTime.now());
        multiProfile2.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(multiProfile2);

        // Create user with three roles (Shop Owner + Farm Owner + Service Provider)
        User multiRole3 = new User();
        multiRole3.setNicNumber("222333444V");
        multiRole3.setName("Multi Role User 3");
        multiRole3.setEmail("multirole3@gmail.com");
        multiRole3.setPhoneNumber("+94789012345");
        multiRole3.setPassword(passwordEncoder.encode("ASd236asd@"));
        multiRole3.setActive(true);
        multiRole3.setVerificationStatus(VerificationStatus.APPROVED);
        multiRole3.setCreatedAt(LocalDateTime.now());
        
        User savedMultiRole3 = userRepository.save(multiRole3);

        // Assign SHOP_OWNER role
        UserRole shopRole3 = new UserRole();
        shopRole3.setUser(savedMultiRole3);
        shopRole3.setRoleName(Role.SHOP_OWNER);
        userRoleRepository.save(shopRole3);

        // Assign FARM_OWNER role
        UserRole farmRole3 = new UserRole();
        farmRole3.setUser(savedMultiRole3);
        farmRole3.setRoleName(Role.FARM_OWNER);
        userRoleRepository.save(farmRole3);

        // Assign SERVICE_PROVIDER role
        UserRole serviceRole3 = new UserRole();
        serviceRole3.setUser(savedMultiRole3);
        serviceRole3.setRoleName(Role.SERVICE_PROVIDER);
        userRoleRepository.save(serviceRole3);

        // Create profile for multi-role user 3
        UserProfile multiProfile3 = new UserProfile();
        multiProfile3.setUser(savedMultiRole3);
        multiProfile3.setBusinessName("Comprehensive Aqua Solutions");
        multiProfile3.setBusinessType("Full Service Aquaculture");
        multiProfile3.setAddressPlace("Aqua Center");
        multiProfile3.setAddressStreet("Fishery Road 300");
        multiProfile3.setAddressDistrict("Kalutara");
        multiProfile3.setAddressTown("Kalutara");
        multiProfile3.setCreatedAt(LocalDateTime.now());
        multiProfile3.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(multiProfile3);

        log.info("Multi-role test users created successfully");
    }

    private void createMoreFishAds() {
        log.info("Creating additional fish ads...");

        User farmOwner = userRepository.findByEmail("testfarm@gmail.com")
                .orElseThrow(() -> new RuntimeException("Test farm owner not found"));

        User multiRole1 = userRepository.findByEmail("multirole1@gmail.com")
                .orElseThrow(() -> new RuntimeException("Multi role user 1 not found"));

        // Create Fish Ad 3 - Farm Owner
        Fish fishAd3 = new Fish();
        fishAd3.setName("Fresh Water Tilapia");
        fishAd3.setDescription("Farm-raised tilapia fish, excellent for family meals. Fresh from our aquaculture ponds with natural feeding.");
        fishAd3.setPrice(1200.00);
        fishAd3.setStock(100);
        fishAd3.setMinimumQuantity(2);
        fishAd3.setNicNumber(farmOwner.getNicNumber());
        fishAd3.setActiveStatus(ActiveStatus.VERIFIED);
        fishAd3.setUser(farmOwner);
        
        fishRepository.save(fishAd3);

        // Create Fish Ad 4 - Multi Role User
        Fish fishAd4 = new Fish();
        fishAd4.setName("Premium Salmon");
        fishAd4.setDescription("High-quality imported salmon, perfect for grilling and sashimi. Rich in omega-3 and premium taste.");
        fishAd4.setPrice(3500.00);
        fishAd4.setStock(25);
        fishAd4.setMinimumQuantity(1);
        fishAd4.setNicNumber(multiRole1.getNicNumber());
        fishAd4.setActiveStatus(ActiveStatus.VERIFIED);
        fishAd4.setUser(multiRole1);
        
        fishRepository.save(fishAd4);

        // Create Fish Ad 5 - Multi Role User
        Fish fishAd5 = new Fish();
        fishAd5.setName("Local Carp Fish");
        fishAd5.setDescription("Fresh local carp fish, ideal for traditional curry preparations. Sustainably farmed with care.");
        fishAd5.setPrice(800.00);
        fishAd5.setStock(80);
        fishAd5.setMinimumQuantity(3);
        fishAd5.setNicNumber(multiRole1.getNicNumber());
        fishAd5.setActiveStatus(ActiveStatus.VERIFIED);
        fishAd5.setUser(multiRole1);
        
        fishRepository.save(fishAd5);

        log.info("Additional fish ads created successfully");
    }

    private void createIndustrialStuffAds() {
        log.info("Creating industrial stuff ads...");

        User industrialSeller = userRepository.findByEmail("testindustrial@gmail.com")
                .orElseThrow(() -> new RuntimeException("Test industrial seller not found"));

        User multiRole2 = userRepository.findByEmail("multirole2@gmail.com")
                .orElseThrow(() -> new RuntimeException("Multi role user 2 not found"));

        // Create Industrial Item 1
        IndustrialStuff industrial1 = new IndustrialStuff();
        industrial1.setName("Aquarium Water Filter System");
        industrial1.setDescription("High-efficiency water filtration system for aquariums and fish tanks. Includes multi-stage filtration with biological, mechanical, and chemical filters.");
        industrial1.setPrice(15000.00);
        industrial1.setStock(20);
        industrial1.setNicNumber(industrialSeller.getNicNumber());
        industrial1.setActiveStatus(ActiveStatus.VERIFIED);
        industrial1.setUser(industrialSeller);
        
        industrialStuffRepository.save(industrial1);

        // Create Industrial Item 2
        IndustrialStuff industrial2 = new IndustrialStuff();
        industrial2.setName("Oxygen Pump for Fish Tanks");
        industrial2.setDescription("Professional-grade oxygen pump system for maintaining optimal oxygen levels in fish tanks and ponds. Quiet operation with adjustable flow rate.");
        industrial2.setPrice(8500.00);
        industrial2.setStock(35);
        industrial2.setNicNumber(industrialSeller.getNicNumber());
        industrial2.setActiveStatus(ActiveStatus.VERIFIED);
        industrial2.setUser(industrialSeller);
        
        industrialStuffRepository.save(industrial2);

        // Create Industrial Item 3 - Multi Role User
        IndustrialStuff industrial3 = new IndustrialStuff();
        industrial3.setName("Fish Feed Pellet Machine");
        industrial3.setDescription("Automatic fish feed pellet making machine for commercial aquaculture. Produces nutritious feed pellets in various sizes.");
        industrial3.setPrice(125000.00);
        industrial3.setStock(5);
        industrial3.setNicNumber(multiRole2.getNicNumber());
        industrial3.setActiveStatus(ActiveStatus.VERIFIED);
        industrial3.setUser(multiRole2);
        
        industrialStuffRepository.save(industrial3);

        // Create Industrial Item 4 - Multi Role User
        IndustrialStuff industrial4 = new IndustrialStuff();
        industrial4.setName("Water Quality Testing Kit");
        industrial4.setDescription("Complete water quality testing kit for pH, ammonia, nitrite, nitrate, and dissolved oxygen levels. Essential for aquaculture management.");
        industrial4.setPrice(4500.00);
        industrial4.setStock(50);
        industrial4.setNicNumber(multiRole2.getNicNumber());
        industrial4.setActiveStatus(ActiveStatus.VERIFIED);
        industrial4.setUser(multiRole2);
        
        industrialStuffRepository.save(industrial4);

        // Create Industrial Item 5
        IndustrialStuff industrial5 = new IndustrialStuff();
        industrial5.setName("Aquaculture Pond Liner");
        industrial5.setDescription("High-quality HDPE pond liner for fish farming ponds. UV resistant, puncture-resistant, and long-lasting. Available in various sizes.");
        industrial5.setPrice(2500.00);
        industrial5.setStock(100);
        industrial5.setNicNumber(industrialSeller.getNicNumber());
        industrial5.setActiveStatus(ActiveStatus.VERIFIED);
        industrial5.setUser(industrialSeller);
        
        industrialStuffRepository.save(industrial5);

        log.info("Industrial stuff ads created successfully");
    }
}