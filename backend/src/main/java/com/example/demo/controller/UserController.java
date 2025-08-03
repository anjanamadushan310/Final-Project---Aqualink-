package com.example.demo.controller;

import com.example.demo.enums.UserRole;
import com.example.demo.service.OTPService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OTPService otpService;

    @GetMapping("/roles")
    public ResponseEntity<List<Map<String, String>>> getUserRoles() {
        List<Map<String, String>> roles = Arrays.stream(UserRole.values())
                .map(role -> {
                    Map<String, String> roleMap = new HashMap<>();
                    roleMap.put("value", role.name());
                    roleMap.put("label", role.getDisplayName());
                    return roleMap;
                })
                .toList();

        return ResponseEntity.ok(roles);
    }

    @GetMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtpToEmail(@RequestParam String email) {
        Map<String, String> response = new HashMap<>();

        try {
            // Basic email validation
            if (email == null || email.trim().isEmpty() || !email.contains("@")) {
                response.put("message", "Invalid email address");
                return ResponseEntity.badRequest().body(response);
            }

            String otp = otpService.generateOTP(email);
            otpService.sendOTPEmail(email, otp);
            response.put("message", "OTP sent successfully to " + email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("message", "Failed to send OTP");
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Map<String, String> response = new HashMap<>();

        if (email == null || email.trim().isEmpty()) {
            response.put("message", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (otp == null || otp.trim().isEmpty()) {
            response.put("message", "OTP is required");
            return ResponseEntity.badRequest().body(response);
        }

        boolean isValid = otpService.verifyOTP(email, otp);

        if (isValid) {
            response.put("message", "OTP verified successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid or expired OTP");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(
            @RequestParam("nicNumber") String nicNumber,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("password") String password,
            @RequestParam("confirmPassword") String confirmPassword,
            @RequestParam("nicDocument") MultipartFile nicDocument,
            @RequestParam("userRoles") List<String> userRoles,
            @RequestParam("otpVerified") boolean otpVerified) {

        Map<String, String> response = new HashMap<>();

        // Check if OTP is verified
        if (!otpVerified) {
            response.put("message", "Registration failed");
            response.put("error", "Please verify your email with OTP first");
            return ResponseEntity.badRequest().body(response);
        }

        // Basic validation
        if (nicNumber == null || nicNumber.trim().isEmpty()) {
            response.put("message", "Registration failed");
            response.put("error", "NIC number is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (name == null || name.trim().isEmpty()) {
            response.put("message", "Registration failed");
            response.put("error", "Name is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (email == null || email.trim().isEmpty()) {
            response.put("message", "Registration failed");
            response.put("error", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRoles == null || userRoles.isEmpty()) {
            response.put("message", "Registration failed");
            response.put("error", "Please select at least one role");
            return ResponseEntity.badRequest().body(response);
        }

        String result = userService.registerUser(nicNumber, name, email, phoneNumber,
                password, confirmPassword, nicDocument, userRoles);

        if (result.equals("User registered successfully")) {
            response.put("message", result);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Registration failed");
            response.put("error", result);
            return ResponseEntity.badRequest().body(response);
        }
    }
}
