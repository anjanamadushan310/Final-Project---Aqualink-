package com.example.aqualink.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OTPService {

    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();

    // Store OTPs temporarily in memory with timestamp
    private final Map<String, OTPData> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    public OTPService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateOTP(String email) {
        // Generate 6 digit OTP
        int otp = 100000 + random.nextInt(900000);
        String otpString = String.valueOf(otp);

        // Store OTP with timestamp (valid for 5 minutes)
        long expiryTime = System.currentTimeMillis() + (5 * 60 * 1000);
        otpStorage.put(email, new OTPData(otpString, expiryTime));

        return otpString;
    }

    public void sendOTPEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your Registration OTP Code");
            message.setText("Your OTP code for registration is: " + otp +
                    "\n\nThis code will expire in 5 minutes." +
                    "\n\nIf you didn't request this code, please ignore this email.");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public boolean verifyOTP(String email, String otp) {
        OTPData otpData = otpStorage.get(email);

        if (otpData == null) {
            return false; // No OTP found for this email
        }

        // Check if OTP is expired
        if (System.currentTimeMillis() > otpData.getExpiryTime()) {
            otpStorage.remove(email); // Remove expired OTP
            return false;
        }

        // Check if OTP matches
        if (otpData.getOtp().equals(otp)) {
            otpStorage.remove(email); // Remove OTP after successful verification
            return true;
        }

        return false;
    }

    public void clearOTP(String email) {
        otpStorage.remove(email);
    }

    // Inner class to store OTP with expiry time
    private static class OTPData {
        private final String otp;
        private final long expiryTime;

        public OTPData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public long getExpiryTime() {
            return expiryTime;
        }
    }
}
