package com.example.aqualink.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aqualink.security.dto.LoginRequest;
import com.example.aqualink.security.dto.LoginResponse;
import com.example.aqualink.security.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.authenticate(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Login failed: " + e.getMessage());
            
            // Create error response with appropriate message
            String errorMessage;
            if (e.getMessage().contains("pending admin approval")) {
                errorMessage = "Your account is pending admin approval. Please wait for verification to complete.";
            } else if (e.getMessage().contains("rejected by the administrator")) {
                errorMessage = "Your account has been rejected by the administrator. Please contact support for more information.";
            } else if (e.getMessage().contains("deactivated")) {
                errorMessage = "Your account has been deactivated. Please contact support.";
            } else if (e.getMessage().contains("Invalid email or password")) {
                errorMessage = "Invalid email or password. Please check your credentials and try again.";
            } else {
                errorMessage = "Login failed. " + e.getMessage();
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(errorMessage));
        }
    }
}