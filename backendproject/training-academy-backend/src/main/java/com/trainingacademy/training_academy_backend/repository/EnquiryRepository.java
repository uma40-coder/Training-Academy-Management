package com.trainingacademy.training_academy_backend.repository;

import com.trainingacademy.training_academy_backend.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
}