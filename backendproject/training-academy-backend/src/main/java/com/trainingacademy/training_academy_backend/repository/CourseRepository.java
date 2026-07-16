package com.trainingacademy.training_academy_backend.repository;

import com.trainingacademy.training_academy_backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}