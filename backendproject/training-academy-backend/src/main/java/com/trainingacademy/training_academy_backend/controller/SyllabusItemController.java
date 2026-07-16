package com.trainingacademy.training_academy_backend.controller;

import com.trainingacademy.training_academy_backend.entity.SyllabusItem;
import com.trainingacademy.training_academy_backend.repository.SyllabusItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/syllabus")
public class SyllabusItemController {

    private final SyllabusItemRepository syllabusItemRepository;

    public SyllabusItemController(SyllabusItemRepository syllabusItemRepository) {
        this.syllabusItemRepository = syllabusItemRepository;
    }

    @GetMapping
    public List<SyllabusItem> getAllSyllabusItems() {
        return syllabusItemRepository.findAll();
    }

    @GetMapping("/{courseName}")
    public List<SyllabusItem> getSyllabusByCourse(@PathVariable String courseName) {
        return syllabusItemRepository.findByCourseName(courseName);
    }

    @PostMapping
    public SyllabusItem addSyllabusItem(@RequestBody SyllabusItem syllabusItem) {
        return syllabusItemRepository.save(syllabusItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSyllabusItem(@PathVariable Long id) {
        if (!syllabusItemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        syllabusItemRepository.deleteById(id);
        return ResponseEntity.ok("Syllabus item deleted successfully");
    }
}