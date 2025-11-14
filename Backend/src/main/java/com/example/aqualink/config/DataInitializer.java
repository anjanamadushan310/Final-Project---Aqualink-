package com.example.aqualink.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.aqualink.entity.Role;
import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserRole;
import com.example.aqualink.entity.VerificationStatus;
import com.example.aqualink.repository.UserRepository;
import com.example.aqualink.repository.UserRoleRepository;

import java.time.LocalDateTime;

@Component
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initData() {
        try {
            createAdminIfNotExists();
        } catch (Exception e) {
            System.err.println("Error during data initialization: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createAdminIfNotExists() {
        String adminEmail = "admin@aqualink.com";

        if (!userRepository.findByEmail(adminEmail).isPresent()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin@12345"));
            admin.setName("System Administrator");
            admin.setPhoneNumber("+94123456789");
            admin.setNicNumber("000000000V");
            
            // Admin account settings
            admin.setEnabled(true);
            admin.setActive(true);
            admin.setVerificationStatus(VerificationStatus.APPROVED);
            admin.setCreatedAt(LocalDateTime.now());
            
            // Document paths can be null for admin as they're pre-verified
            admin.setNicFrontDocumentPath(null);
            admin.setNicBackDocumentPath(null);
            admin.setSelfieDocumentPath(null);
            
            System.out.println("Creating admin user with APPROVED verification status");

            User savedAdmin = userRepository.save(admin);

            UserRole adminRole = new UserRole();
            adminRole.setUser(savedAdmin);
            adminRole.setRoleName(Role.ADMIN);

            System.out.println("About to save UserRole: " + adminRole);
            UserRole savedRole = userRoleRepository.save(adminRole);
            System.out.println("✅ Admin user created successfully!");
            System.out.println("📧 Email: " + savedAdmin.getEmail());
            System.out.println("🔐 Password: admin@12345");
            System.out.println("✅ Verification Status: " + savedAdmin.getVerificationStatus());
            System.out.println("👤 Role: " + savedRole.getRoleName());

        } else {
            System.out.println("ℹ️ Admin user already exists, skipping creation.");
        }
    }
}
