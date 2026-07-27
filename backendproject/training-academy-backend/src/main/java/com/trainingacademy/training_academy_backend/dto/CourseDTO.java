package com.trainingacademy.training_academy_backend.dto;

import lombok.Data;

@Data
public class CourseDTO {
    private String name;
    private String duration;
    private String fee;
    private String description;
}