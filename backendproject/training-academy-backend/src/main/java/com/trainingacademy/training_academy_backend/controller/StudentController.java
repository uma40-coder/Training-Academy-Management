package com.trainingacademy.training_academy_backend.controller;

import com.trainingacademy.training_academy_backend.entity.Student;
import com.trainingacademy.training_academy_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

 @PostMapping("/register")
public ResponseEntity<?> registerStudent(@RequestBody Student student) {
    if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Email is required");
    }

    if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
        return ResponseEntity.badRequest().body("Email already registered");
    }

    try {
        // BCrypt-encode the password so login can verify it
        if (student.getPassword() != null && !student.getPassword().isEmpty()) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
        student.setStatus("pending");
        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(savedStudent);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Email already registered");
    }
}

    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest loginRequest) {
        Student student = studentRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest().body("Email not found");
        }

        if (!student.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body("Wrong password");
        }

        if ("inactive".equalsIgnoreCase(student.getStatus())) {
            return ResponseEntity.badRequest().body("Account deactivated");
        }

        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStudentStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest statusRequest
    ) {
        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        student.setStatus(statusRequest.getStatus());
        Student updatedStudent = studentRepository.save(student);

        return ResponseEntity.ok(updatedStudent);
    }

    @PutMapping("/{id}/assign-mentor")
    public ResponseEntity<?> assignMentor(
            @PathVariable Long id,
            @RequestBody AssignMentorRequest assignMentorRequest
    ) {
        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        student.setAssignedMentor(assignMentorRequest.getAssignedMentor());
        Student updatedStudent = studentRepository.save(student);

        return ResponseEntity.ok(updatedStudent);
    }

    @PutMapping("/{id}/mentor-review")
    public ResponseEntity<?> updateMentorReview(
            @PathVariable Long id,
            @RequestBody MentorReviewRequest mentorReviewRequest
    ) {
        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        student.setMentorRecommendation(mentorReviewRequest.getMentorRecommendation());
        student.setMentorComment(mentorReviewRequest.getMentorComment());

        Student updatedStudent = studentRepository.save(student);

        return ResponseEntity.ok(updatedStudent);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateStudentProfile(
            @PathVariable Long id,
            @RequestBody Student profileDetails
    ) {
        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        if (profileDetails.getFirstName() != null && !profileDetails.getFirstName().trim().isEmpty()) {
            student.setFirstName(profileDetails.getFirstName());
        }

        if (profileDetails.getLastName() != null && !profileDetails.getLastName().trim().isEmpty()) {
            student.setLastName(profileDetails.getLastName());
        }

        if (profileDetails.getPhone() != null && !profileDetails.getPhone().trim().isEmpty()) {
            student.setPhone(profileDetails.getPhone());
        }

        Student updatedStudent = studentRepository.save(student);
        return ResponseEntity.ok(updatedStudent);
    }

    public static class StatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class AssignMentorRequest {
        private Long assignedMentor;

        public Long getAssignedMentor() {
            return assignedMentor;
        }

        public void setAssignedMentor(Long assignedMentor) {
            this.assignedMentor = assignedMentor;
        }
    }

    public static class MentorReviewRequest {
        private String mentorRecommendation;
        private String mentorComment;

        public String getMentorRecommendation() {
            return mentorRecommendation;
        }

        public String getMentorComment() {
            return mentorComment;
        }

        public void setMentorRecommendation(String mentorRecommendation) {
            this.mentorRecommendation = mentorRecommendation;
        }

        public void setMentorComment(String mentorComment) {
            this.mentorComment = mentorComment;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}