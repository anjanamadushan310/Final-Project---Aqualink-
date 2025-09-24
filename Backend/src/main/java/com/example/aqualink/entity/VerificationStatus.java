package com.example.aqualink.entity;

public enum VerificationStatus {
    PENDING,    // User registered but not yet reviewed by admin
    APPROVED,   // User approved by admin
    REJECTED    // User rejected by admin
}