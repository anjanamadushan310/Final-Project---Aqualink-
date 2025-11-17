package com.example.aqualink.config;

import com.example.aqualink.entity.*;
import com.example.aqualink.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserProfileRepository userProfileRepository;
    private final FishRepository fishRepository;
    private final IndustrialStuffRepository industrialStuffRepository;
    private final ServiceRepository serviceRepository;
    private final BlogPostRepository blogPostRepository;
    private final BlogCommentRepository blogCommentRepository;
    private final DeliveryPersonCoverageRepository deliveryPersonCoverageRepository;
    private final BannerRepository bannerRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedDatabase() {
        return args -> {
            if (shouldSeedData()) {
                log.info("🌱 Starting database seeding...");
                seedUsers();
                seedUserProfiles();
                seedFishAds();
                seedIndustrialStuff();
                seedServices();
                seedBlogPosts();
                seedBlogComments();
                seedDeliveryCoverage();
                seedBanners();
                log.info("✅ Database seeding completed successfully!");
            } else {
                log.info("ℹ️ Database already seeded, skipping...");
            }
        };
    }

    private boolean shouldSeedData() {
        // Skip seeding if we already have users (other than the auto-created admin)
        long userCount = userRepository.count();
        return userCount <= 1; // Only admin exists or database is empty
    }

    @Transactional
    public void seedUsers() {
        log.info("Seeding users...");
        
        String encodedPassword = passwordEncoder.encode("password123");
        
        // Shop Owners
        createUser(2L, "199612345678", "Lakshitha Perera", "lakshitha@shop.com", 
                   "+94771234568", encodedPassword, Role.SHOP_OWNER);
        createUser(3L, "199712345678", "Nimal Silva", "nimal@shop.com", 
                   "+94771234569", encodedPassword, Role.SHOP_OWNER);
        
        // Farm Owners
        createUser(4L, "199812345678", "Sunil Fernando", "sunil@farm.com", 
                   "+94771234570", encodedPassword, Role.FARM_OWNER, Role.EXPORTER);
        createUser(5L, "199912345678", "Kamal Jayasinghe", "kamal@farm.com", 
                   "+94771234571", encodedPassword, Role.FARM_OWNER);
        
        // Exporters
        createUser(6L, "200012345678", "Pradeep Wijesinghe", "pradeep@export.com", 
                   "+94771234572", encodedPassword, Role.EXPORTER);
        createUser(7L, "200112345678", "Chandana Rathnayake", "chandana@export.com", 
                   "+94771234573", encodedPassword, Role.EXPORTER);
        
        // Service Providers
        createUser(8L, "200212345678", "Ravi Dissanayake", "ravi@service.com", 
                   "+94771234574", encodedPassword, Role.SERVICE_PROVIDER);
        createUser(9L, "200312345678", "Anjana Madushan", "anjana@service.com", 
                   "+94771234575", encodedPassword, Role.SERVICE_PROVIDER);
        
        // Industrial Stuff Sellers
        createUser(10L, "200412345678", "Mahesh Gunasekara", "mahesh@industrial.com", 
                   "+94771234576", encodedPassword, Role.INDUSTRIAL_STUFF_SELLER);
        createUser(11L, "200512345678", "Tharaka Bandara", "tharaka@industrial.com", 
                   "+94771234577", encodedPassword, Role.INDUSTRIAL_STUFF_SELLER);
        
        // Delivery Persons
        createUser(12L, "200612345678", "Kasun Perera", "kasun@delivery.com", 
                   "+94771234578", encodedPassword, Role.DELIVERY_PERSON);
        createUser(13L, "200712345678", "Dinesh Silva", "dinesh@delivery.com", 
                   "+94771234579", encodedPassword, Role.DELIVERY_PERSON);
        createUser(14L, "200812345678", "Ruwan Fernando", "ruwan@delivery.com", 
                   "+94771234580", encodedPassword, Role.DELIVERY_PERSON);
        
        // Regular Customers
        createUser(15L, "200912345678", "Nuwan Kumara", "nuwan@customer.com", 
                   "+94771234581", encodedPassword);
        createUser(16L, "201012345678", "Samantha De Silva", "samantha@customer.com", 
                   "+94771234582", encodedPassword);
        
        log.info("✅ Created {} users", userRepository.count());
    }

    private void createUser(Long id, String nicNumber, String name, String email, 
                           String phoneNumber, String encodedPassword, Role... roles) {
        if (userRepository.findByEmail(email).isPresent()) {
            return; // Skip if user already exists
        }
        
        User user = new User();
        user.setNicNumber(nicNumber);
        user.setName(name);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setPassword(encodedPassword);
        user.setActive(true);
        user.setEnabled(true);
        user.setVerificationStatus(VerificationStatus.APPROVED);
        user.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        // Assign roles
        for (Role role : roles) {
            UserRole userRole = new UserRole();
            userRole.setUser(savedUser);
            userRole.setRoleName(role);
            userRoleRepository.save(userRole);
        }
    }

    @Transactional
    public void seedUserProfiles() {
        log.info("Seeding user profiles...");
        
        createProfile("lakshitha@shop.com", "Lakshitha Fish Market", "Fish Market", 
                     "Colombo", "123 Galle Road", "Colombo", "Colombo 03");
        
        createProfile("nimal@shop.com", "Nimal Seafood Center", "Seafood Shop",
                     "Negombo", "456 Main Street", "Gampaha", "Negombo");
        
        createProfile("sunil@farm.com", "Sunil Aqua Farm", "Fish Farm",
                     "Chilaw", "Aqua Farm Road", "Puttalam", "Chilaw");
        
        createProfile("kamal@farm.com", "Kamal Fish Hatchery", "Fish Hatchery",
                     "Kurunegala", "Lake View", "Kurunegala", "Kurunegala");
        
        createProfile("pradeep@export.com", "Pradeep Export Traders", "Export Company",
                     "Katunayake", "789 Export Zone", "Gampaha", "Katunayake");
        
        createProfile("chandana@export.com", "Chandana Global Exports", "Export Company",
                     "Biyagama", "Free Trade Zone", "Gampaha", "Biyagama");
        
        createProfile("ravi@service.com", "Ravi Aquarium Services", "Service Provider",
                     "Kandy", "101 Service Lane", "Kandy", "Kandy");
        
        createProfile("anjana@service.com", "Anjana Pond Consulting", "Consulting Service",
                     "Matara", "202 Consultant Street", "Matara", "Matara");
        
        createProfile("mahesh@industrial.com", "Mahesh Equipment Supplies", "Equipment Supplier",
                     "Horana", "303 Industrial Park", "Kalutara", "Horana");
        
        createProfile("tharaka@industrial.com", "Tharaka Aqua Tech", "Equipment Supplier",
                     "Moratuwa", "404 Tech Zone", "Colombo", "Moratuwa");
        
        log.info("✅ Created user profiles");
    }

    private void createProfile(String email, String businessName, String businessType,
                              String addressPlace, String addressStreet, String addressDistrict, String addressTown) {
        userRepository.findByEmail(email).ifPresent(user -> {
            if (user.getUserProfile() == null) {
                UserProfile profile = new UserProfile();
                profile.setUser(user);
                profile.setBusinessName(businessName);
                profile.setBusinessType(businessType);
                profile.setAddressPlace(addressPlace);
                profile.setAddressStreet(addressStreet);
                profile.setAddressDistrict(addressDistrict);
                profile.setAddressTown(addressTown);
                userProfileRepository.save(profile);
            }
        });
    }

    @Transactional
    public void seedFishAds() {
        log.info("Seeding fish ads...");
        
        User sunil = userRepository.findByEmail("sunil@farm.com").orElse(null);
        User kamal = userRepository.findByEmail("kamal@farm.com").orElse(null);
        
        if (sunil != null) {
            createFishAd(sunil, "Tilapia", "Fresh Tilapia fish, farm-raised with organic feed. Perfect for grilling and curries.", 
                        500, 450.00, 5);
            createFishAd(sunil, "Catfish", "Premium quality Catfish, locally bred. Ideal for traditional Sri Lankan recipes.", 
                        300, 550.00, 3);
            createFishAd(sunil, "Carp", "Large Carp fish, freshwater species. Great source of protein.", 
                        200, 650.00, 2);
            createFishAd(sunil, "Giant Gourami", "Large Giant Gourami, suitable for big ponds and aquaculture.", 
                        100, 1200.00, 2);
            createFishAd(sunil, "Fingerlings - Tilapia", "Tilapia fingerlings for pond stocking. Healthy and fast-growing.", 
                        5000, 15.00, 100);
            createFishAd(sunil, "Freshwater Prawns", "Giant freshwater prawns, excellent for aquaculture.", 
                        250, 850.00, 5);
        }
        
        if (kamal != null) {
            createFishAd(kamal, "Gourami", "Colorful Gourami fish, perfect for aquariums and home ponds.", 
                        1000, 150.00, 10);
            createFishAd(kamal, "Koi Fish", "Beautiful ornamental Koi fish in various colors. Premium quality.", 
                        150, 2500.00, 1);
            createFishAd(kamal, "Goldfish", "Classic Goldfish varieties, healthy and vibrant. Perfect for beginners.", 
                        800, 200.00, 5);
            createFishAd(kamal, "Barb Fish", "Active and hardy Barb fish species. Great for community tanks.", 
                        600, 180.00, 10);
        }
        
        log.info("✅ Created fish ads");
    }

    private void createFishAd(User user, String name, String description, int stock, double price, int minQty) {
        Fish fish = new Fish();
        fish.setUser(user);
        fish.setNicNumber(user.getNicNumber());
        fish.setName(name);
        fish.setDescription(description);
        fish.setStock(stock);
        fish.setPrice(price);
        fish.setMinimumQuantity(minQty);
        fish.setActiveStatus(ActiveStatus.VERIFIED);
        fish.setCreateDateAndTime(LocalDateTime.now());
        fishRepository.save(fish);
    }

    @Transactional
    public void seedIndustrialStuff() {
        log.info("Seeding industrial equipment...");
        
        User mahesh = userRepository.findByEmail("mahesh@industrial.com").orElse(null);
        User tharaka = userRepository.findByEmail("tharaka@industrial.com").orElse(null);
        
        if (mahesh != null) {
            createEquipment(mahesh, "Aquarium Filter System", 
                          "High-efficiency filtration system for aquariums up to 500L. Includes biological and mechanical filtration.", 
                          50, 8500.00, 1);
            createEquipment(mahesh, "Fish Food - Premium Mix", 
                          "Nutritious fish food pellets suitable for all fish species. 5kg pack.", 
                          200, 1200.00, 2);
            createEquipment(mahesh, "Pond Aerator", 
                          "Electric pond aerator with air stone. Suitable for ponds up to 1000L.", 
                          30, 12500.00, 1);
            createEquipment(mahesh, "Water Testing Kit", 
                          "Complete water quality testing kit. Tests pH, ammonia, nitrite, and nitrate levels.", 
                          100, 2500.00, 1);
            createEquipment(mahesh, "Fish Net - Professional", 
                          "Durable nylon fish net with extendable handle. Large size.", 
                          150, 850.00, 1);
            createEquipment(mahesh, "Pond Liner Sheet", 
                          "Heavy-duty HDPE pond liner. 4m x 6m sheet.", 
                          60, 9500.00, 1);
            createEquipment(mahesh, "Aquarium LED Light", 
                          "Energy-efficient LED lighting for aquariums. Adjustable brightness.", 
                          100, 4500.00, 1);
        }
        
        if (tharaka != null) {
            createEquipment(tharaka, "Automatic Fish Feeder", 
                          "Programmable automatic fish feeder. Perfect for busy fish farmers.", 
                          40, 6500.00, 1);
            createEquipment(tharaka, "UV Sterilizer", 
                          "UV water sterilizer for disease prevention. 25W capacity.", 
                          25, 15000.00, 1);
            createEquipment(tharaka, "Breeding Tank Kit", 
                          "Complete breeding tank setup with dividers and accessories.", 
                          20, 18500.00, 1);
            createEquipment(tharaka, "Water Heater - Aquarium", 
                          "Adjustable water heater for tropical fish. 300W.", 
                          80, 3500.00, 1);
            createEquipment(tharaka, "Fish Transport Bags", 
                          "Oxygen-filled transport bags for live fish. Pack of 100.", 
                          500, 2000.00, 5);
        }
        
        log.info("✅ Created industrial equipment");
    }

    private void createEquipment(User user, String name, String description, int stock, double price, int minQty) {
        IndustrialStuff equipment = new IndustrialStuff();
        equipment.setUser(user);
        equipment.setNicNumber(user.getNicNumber());
        equipment.setName(name);
        equipment.setDescription(description);
        equipment.setStock(stock);
        equipment.setPrice(price);
        equipment.setActiveStatus(ActiveStatus.VERIFIED);
        equipment.setCreateDateAndTime(LocalDateTime.now());
        industrialStuffRepository.save(equipment);
    }

    @Transactional
    public void seedServices() {
        log.info("Seeding services...");
        
        User ravi = userRepository.findByEmail("ravi@service.com").orElse(null);
        User anjana = userRepository.findByEmail("anjana@service.com").orElse(null);
        
        if (ravi != null) {
            createService(ravi, "Aquarium Setup & Installation", 
                        "Professional aquarium setup service including tank, filtration, lighting, and decoration. We handle everything from delivery to installation and initial fish stocking.", 
                        "Installation", 25000.00);
            createService(ravi, "Aquarium Maintenance - Monthly", 
                        "Regular monthly maintenance service including water changes, filter cleaning, algae removal, and health checkups.", 
                        "Maintenance", 3500.00);
            createService(ravi, "Fish Disease Treatment", 
                        "Expert diagnosis and treatment of fish diseases. Includes consultation and medication.", 
                        "Healthcare", 5000.00);
            createService(ravi, "Emergency Fish Care", 
                        "24/7 emergency fish care service for critical situations. Call-out service.", 
                        "Emergency", 7500.00);
            createService(ravi, "Custom Aquarium Design", 
                        "Custom aquarium design service for homes and offices. Includes 3D visualization.", 
                        "Design", 12000.00);
        }
        
        if (anjana != null) {
            createService(anjana, "Fish Farm Consultation", 
                        "Professional consultation for starting or improving fish farming operations. Includes site visit and detailed report.", 
                        "Consultation", 15000.00);
            createService(anjana, "Pond Construction Service", 
                        "Complete pond construction service including excavation, lining, and plumbing setup.", 
                        "Construction", 150000.00);
            createService(anjana, "Fish Farming Training Program", 
                        "Comprehensive 2-day training program on modern fish farming techniques and best practices.", 
                        "Training", 8000.00);
            createService(anjana, "Water Quality Management", 
                        "Water quality testing and management service. Includes testing, analysis, and recommendations.", 
                        "Management", 6500.00);
        }
        
        log.info("✅ Created services");
    }

    private void createService(User user, String name, String description, String category, double price) {
        Service service = new Service();
        service.setServiceProviderId(user.getId());
        service.setName(name);
        service.setDescription(description);
        service.setCategory(category);
        service.setPrice(new java.math.BigDecimal(price));
        service.setApprovalStatus(Service.ApprovalStatus.APPROVED);
        service.setCreatedAt(LocalDateTime.now());
        serviceRepository.save(service);
    }

    @Transactional
    public void seedBlogPosts() {
        log.info("Seeding blog posts...");
        
        User pradeep = userRepository.findByEmail("pradeep@export.com").orElse(null);
        User chandana = userRepository.findByEmail("chandana@export.com").orElse(null);
        
        if (pradeep != null) {
            createBlogPost(pradeep, "Best Practices for Fish Farming in Sri Lanka",
                "<h2>Introduction to Modern Fish Farming</h2><p>Fish farming in Sri Lanka has evolved significantly over the past decade...</p>",
                LocalDateTime.now().minusDays(10), 245);
            
            createBlogPost(pradeep, "Export Quality Standards for Seafood",
                "<h2>Understanding International Seafood Standards</h2><p>Exporting seafood requires strict adherence to international quality and safety standards...</p>",
                LocalDateTime.now().minusDays(8), 189);
            
            createBlogPost(pradeep, "Sustainable Fishing Practices for the Future",
                "<h2>The Importance of Sustainability</h2><p>As the global demand for seafood continues to rise, sustainable fishing practices have never been more important...</p>",
                LocalDateTime.now().minusDays(3), 156);
        }
        
        if (chandana != null) {
            createBlogPost(chandana, "Setting Up Your First Aquarium: A Beginner's Guide",
                "<h2>Welcome to the World of Aquariums!</h2><p>Starting your first aquarium can be an exciting journey...</p>",
                LocalDateTime.now().minusDays(5), 312);
            
            createBlogPost(chandana, "Common Fish Diseases and How to Prevent Them",
                "<h2>Fish Health Management</h2><p>Preventing fish diseases is far more effective than treating them...</p>",
                LocalDateTime.now().minusDays(2), 98);
        }
        
        log.info("✅ Created blog posts");
    }

    private void createBlogPost(User author, String title, String content, LocalDateTime createdAt, int views) {
        BlogPost post = new BlogPost();
        post.setAuthor(author);
        post.setTitle(title);
        post.setContent(content);
        post.setPublished(true);
        post.setCreatedAt(createdAt);
        post.setUpdatedAt(createdAt);
        post.setPublishedAt(createdAt);
        blogPostRepository.save(post);
    }

    @Transactional
    public void seedBlogComments() {
        log.info("Seeding blog comments...");
        // Blog comments seeding would go here
        // Simplified for brevity
    }

    @Transactional
    public void seedDeliveryCoverage() {
        log.info("Seeding delivery coverage...");
        
        User kasun = userRepository.findByEmail("kasun@delivery.com").orElse(null);
        User dinesh = userRepository.findByEmail("dinesh@delivery.com").orElse(null);
        User ruwan = userRepository.findByEmail("ruwan@delivery.com").orElse(null);
        
        if (kasun != null) {
            createCoverage(kasun, "Colombo", "Colombo 01-15", 50.00);
            createCoverage(kasun, "Colombo", "Dehiwala", 50.00);
            createCoverage(kasun, "Colombo", "Mount Lavinia", 50.00);
            createCoverage(kasun, "Colombo", "Nugegoda", 50.00);
        }
        
        if (dinesh != null) {
            createCoverage(dinesh, "Gampaha", "Gampaha", 45.00);
            createCoverage(dinesh, "Gampaha", "Negombo", 45.00);
            createCoverage(dinesh, "Gampaha", "Wattala", 45.00);
            createCoverage(dinesh, "Gampaha", "Kadawatha", 45.00);
        }
        
        if (ruwan != null) {
            createCoverage(ruwan, "Kalutara", "Kalutara", 40.00);
            createCoverage(ruwan, "Kalutara", "Panadura", 40.00);
            createCoverage(ruwan, "Kalutara", "Horana", 40.00);
        }
        
        log.info("✅ Created delivery coverage areas");
    }

    private void createCoverage(User user, String district, String city, double chargePerKm) {
        DeliveryPersonCoverage coverage = new DeliveryPersonCoverage();
        coverage.setDeliveryPersonUser(user);
        coverage.setTowns(List.of(city)); // Using helper method to set towns
        deliveryPersonCoverageRepository.save(coverage);
    }

    @Transactional
    public void seedBanners() {
        log.info("Seeding banners...");
        
        createBanner("/banners/welcome-to-aqualink.jpg");
        createBanner("/banners/fresh-fish-delivery.jpg");
        createBanner("/banners/aquaculture-equipment.jpg");
        createBanner("/banners/expert-consultation.jpg");
        createBanner("/banners/sustainable-farming.jpg");
        
        log.info("✅ Created banners");
    }

    private void createBanner(String imageUrl) {
        Banner banner = new Banner();
        banner.setImageUrl(imageUrl);
        bannerRepository.save(banner);
    }
}
