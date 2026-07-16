package com.trainingacademy.training_academy_backend.controller;

import com.trainingacademy.training_academy_backend.entity.Enquiry;
import com.trainingacademy.training_academy_backend.repository.EnquiryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;

    public EnquiryController(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    @GetMapping
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }

    @PostMapping
    public Enquiry submitEnquiry(@RequestBody Enquiry enquiry) {
        return enquiryRepository.save(enquiry);
    }
}