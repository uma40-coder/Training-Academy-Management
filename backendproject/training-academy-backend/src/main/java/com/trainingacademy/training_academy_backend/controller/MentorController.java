package com.trainingacademy.training_academy_backend.controller;

import com.trainingacademy.training_academy_backend.entity.Mentor;
import com.trainingacademy.training_academy_backend.repository.MentorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final MentorRepository mentorRepository;

    public MentorController(MentorRepository mentorRepository) {
        this.mentorRepository = mentorRepository;
    }

    @GetMapping
    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addMentor(@RequestBody Mentor mentor) {
        if (mentorRepository.findByEmail(mentor.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        mentor.setPassword("Mentor@123");
        return ResponseEntity.ok(mentorRepository.save(mentor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMentor(@PathVariable Long id, @RequestBody Mentor mentorDetails) {
        Mentor mentor = mentorRepository.findById(id).orElse(null);

        if (mentor == null) {
            return ResponseEntity.notFound().build();
        }

        mentor.setName(mentorDetails.getName());
        mentor.setSpecialization(mentorDetails.getSpecialization());
        mentor.setEmail(mentorDetails.getEmail());
        mentor.setPhone(mentorDetails.getPhone());
        mentor.setExperience(mentorDetails.getExperience());
        mentor.setAbout(mentorDetails.getAbout());

        return ResponseEntity.ok(mentorRepository.save(mentor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMentor(@PathVariable Long id) {
        if (!mentorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        mentorRepository.deleteById(id);
        return ResponseEntity.ok("Mentor deleted successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMentor(@RequestBody MentorLoginRequest loginRequest) {
        Mentor mentor = mentorRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        if (mentor == null) {
            return ResponseEntity.badRequest().body("Email not found");
        }

        if (!mentor.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        return ResponseEntity.ok(mentor);
    }

    public static class MentorLoginRequest {
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