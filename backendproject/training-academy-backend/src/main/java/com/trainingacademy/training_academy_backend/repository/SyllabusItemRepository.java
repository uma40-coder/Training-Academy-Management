package com.trainingacademy.training_academy_backend.repository;

import com.trainingacademy.training_academy_backend.entity.SyllabusItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SyllabusItemRepository extends JpaRepository<SyllabusItem, Long> {
    List<SyllabusItem> findByCourseName(String courseName);
}