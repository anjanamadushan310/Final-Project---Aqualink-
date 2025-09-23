package com.example.aqualink.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVerificationDTO {
    private Long id;
    private String name;
    private String email;
    private String nicNumber;
    private String phoneNumber;
    private List<String> userRoles;
    private String status; // ACTIVE, INACTIVE, REJECTED
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    // Document paths for verification
    private String nicFrontDocument;
    private String nicBackDocument;
    private String selfieDocument;
    
    // Additional fields for admin use
    private String verificationNotes;
    private Long verifiedBy;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime verifiedAt;

    // Constructor for basic user info without verification details
    public UserVerificationDTO(Long id, String name, String email, String nicNumber, 
                             String phoneNumber, List<String> userRoles, String status, 
                             LocalDateTime createdAt, String nicFrontDocument, 
                             String nicBackDocument, String selfieDocument) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.nicNumber = nicNumber;
        this.phoneNumber = phoneNumber;
        this.userRoles = userRoles;
        this.status = status;
        this.createdAt = createdAt;
        this.nicFrontDocument = nicFrontDocument;
        this.nicBackDocument = nicBackDocument;
        this.selfieDocument = selfieDocument;
    }
}