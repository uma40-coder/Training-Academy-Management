package com.trainingacademy.training_academy_backend.controller;

import com.trainingacademy.training_academy_backend.entity.AppNotification;
import com.trainingacademy.training_academy_backend.repository.AppNotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class AppNotificationController {

    private final AppNotificationRepository notificationRepository;

    public AppNotificationController(AppNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<AppNotification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @PostMapping
    public AppNotification sendNotification(@RequestBody AppNotification notification) {
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm a"));
        notification.setTime(time);
        return notificationRepository.save(notification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        if (!notificationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        notificationRepository.deleteById(id);
        return ResponseEntity.ok("Notification deleted successfully");
    }
}