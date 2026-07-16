package com.trainingacademy.training_academy_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;
    private String phone;
    private String course;
    private String timing;
    private String status = "pending";

    private Long assignedMentor;
    private String mentorRecommendation;

@Column(length = 1000)
private String mentorComment;

    public Student() {
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public String getCourse() {
        return course;
    }

    public String getTiming() {
        return timing;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public void setTiming(String timing) {
        this.timing = timing;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAssignedMentor() {
    return assignedMentor;
}

public String getMentorRecommendation() {
    return mentorRecommendation;
}

public String getMentorComment() {
    return mentorComment;
}

public void setAssignedMentor(Long assignedMentor) {
    this.assignedMentor = assignedMentor;
}

public void setMentorRecommendation(String mentorRecommendation) {
    this.mentorRecommendation = mentorRecommendation;
}

public void setMentorComment(String mentorComment) {
    this.mentorComment = mentorComment;
}
}