package com.trainingacademy.training_academy_backend.dto;

import lombok.Data;

@Data
public class MentorDTO {
    private String name;
    private String specialization;
    private String email;
    private String phone;
    private String experience;
    private String about;
}