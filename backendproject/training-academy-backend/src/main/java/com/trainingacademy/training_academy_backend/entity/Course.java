package com.trainingacademy.training_academy_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String duration;
    private Double fee;

    @Column(length = 1000)
    private String description;

    public Course() {
    }

    public Course(Long id, String name, String duration, Double fee, String description) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.fee = fee;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDuration() {
        return duration;
    }

    public Double getFee() {
        return fee;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}