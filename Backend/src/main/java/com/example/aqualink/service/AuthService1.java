package com.example.aqualink.service;

import com.example.aqualink.dto.AuthResponse;
import com.example.aqualink.dto.LoginRequest;
import com.example.aqualink.dto.RegisterRequest;
import com.example.aqualink.entity.User1;
import com.example.aqualink.repository.UserRepository1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService1 {

    @Autowired
    private UserRepository1 userRepository1;

    public AuthResponse register(RegisterRequest request) {
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        
        if (userRepository1.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

  
        if (request.getNicNumber() != null && userRepository1.existsByNicNumber(request.getNicNumber())) {
            throw new RuntimeException("NIC number already exists");
        }

      
        User1 user = new User1();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(request.getPassword()); 
        user.setNicNumber(request.getNicNumber());

        User1 savedUser = userRepository1.save(user);

        return new AuthResponse(
            "Registration successful",
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getName()
        );
    }

    public AuthResponse login(LoginRequest request) {
        
        User1 user = userRepository1.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new AuthResponse(
            "Login successful",
            user.getId(),
            user.getEmail(),
            user.getName()
        );
    }
}
