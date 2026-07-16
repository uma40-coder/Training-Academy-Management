package com.trainingacademy.training_academy_backend.repository;

import com.trainingacademy.training_academy_backend.entity.AppNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppNotificationRepository extends JpaRepository<AppNotification, Long> {
}