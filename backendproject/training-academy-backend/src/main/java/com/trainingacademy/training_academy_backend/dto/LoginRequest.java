package com.trainingacademy.training_academy_backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private String role;
}