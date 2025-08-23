package com.example.aqualink.config;

import com.example.aqualink.entity.Role;
import com.example.aqualink.entity.User;
import com.example.aqualink.entity.UserRole;
import com.example.aqualink.repository.UserRepository;
import com.example.aqualink.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        String adminEmail = "admin@aqualink.com";

        if (!userRepository.findByEmail(adminEmail).isPresent()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin@12345"));
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setEnabled(true);
            admin.setName("System Administrator");
            admin.setPhoneNumber("0000000000");
            admin.setNicNumber("000000000V");
            admin.setEnabled(true); // Make sure this is set
            admin.setActive(true);
            // Set other required fields...

            User savedAdmin = userRepository.save(admin);

            UserRole adminRole = new UserRole();
            adminRole.setUser(savedAdmin);
            adminRole.setRoleName(Role.ADMIN);

            System.out.println("About to save UserRole: " + adminRole);
            UserRole savedRole = userRoleRepository.save(adminRole);
            System.out.println("UserRole saved successfully: " + savedRole);

        }
    }
}
