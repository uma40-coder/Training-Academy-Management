package com.trainingacademy.training_academy_backend.dto;

import lombok.Data;

@Data
public class StudentDTO {
    private String fname;
    private String lname;
    private String email;
    private String password;
    private String phone;
    private String course;
    private String timing;
}