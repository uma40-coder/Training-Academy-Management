package com.trainingacademy.training_academy_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "syllabus_items")
public class SyllabusItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;
    private String moduleName;
    private String topicName;

    public SyllabusItem() {
    }

    public Long getId() {
        return id;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getModuleName() {
        return moduleName;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }
}