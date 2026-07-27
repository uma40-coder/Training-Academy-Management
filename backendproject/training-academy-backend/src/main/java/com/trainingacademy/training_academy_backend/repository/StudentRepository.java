package com.trainingacademy.training_academy_backend.repository;

import com.trainingacademy.training_academy_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    List<Student> findByStatus(String status);
    List<Student> findByAssignedMentor(Long mentorId);
    boolean existsByEmail(String email); // ← this add pannunga!
}