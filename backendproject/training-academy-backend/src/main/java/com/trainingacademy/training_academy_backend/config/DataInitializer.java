package com.trainingacademy.training_academy_backend.config;

import com.trainingacademy.training_academy_backend.entity.Admin;
import com.trainingacademy.training_academy_backend.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@nexacademy.com";
            if (adminRepository.findByEmail(adminEmail).isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("NexAdmin@2026"));
                admin.setName("Admin");
                adminRepository.save(admin);
                System.out.println("✅ Default admin seeded: " + adminEmail);
            } else {
                System.out.println("ℹ️  Admin already exists, skipping seed.");
            }
        };
    }
}
