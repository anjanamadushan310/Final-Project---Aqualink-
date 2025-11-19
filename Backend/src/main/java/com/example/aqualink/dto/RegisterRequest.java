package com.example.aqualink.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String name;
    private String password;
    private String confirmPassword;
    private String nicNumber;
}
