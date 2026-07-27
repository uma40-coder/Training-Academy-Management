package com.trainingacademy.training_academy_backend.controller;

import com.trainingacademy.training_academy_backend.dto.LoginRequest;
import com.trainingacademy.training_academy_backend.dto.LoginResponse;
import com.trainingacademy.training_academy_backend.dto.StudentDTO;
import com.trainingacademy.training_academy_backend.entity.Admin;
import com.trainingacademy.training_academy_backend.entity.Mentor;
import com.trainingacademy.training_academy_backend.entity.Student;
import com.trainingacademy.training_academy_backend.repository.AdminRepository;
import com.trainingacademy.training_academy_backend.repository.MentorRepository;
import com.trainingacademy.training_academy_backend.repository.StudentRepository;
import com.trainingacademy.training_academy_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    // ── Student Register ──
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody StudentDTO dto) {

        if (studentRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Email already registered!"));
        }

        Student student = new Student();
       student.setFirstName(dto.getFname());  
student.setLastName(dto.getLname());  
        student.setEmail(dto.getEmail());
        student.setPassword(passwordEncoder.encode(dto.getPassword()));
        student.setPhone(dto.getPhone());
        student.setCourse(dto.getCourse());
        student.setTiming(dto.getTiming());
        student.setStatus("pending");

        studentRepository.save(student);

        return ResponseEntity.ok(Map.of("message", "Registered successfully!"));
    }

    // ── Login ──
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        String role = request.getRole();

        // ── Student Login ──
        if ("student".equals(role)) {
            Optional<Student> studentOpt = studentRepository.findByEmail(request.getEmail());

            if (studentOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email not found!"));
            }

            Student student = studentOpt.get();

            // Try BCrypt match first (new students)
            boolean passwordMatches = false;
            try {
                passwordMatches = passwordEncoder.matches(request.getPassword(), student.getPassword());
            } catch (Exception ignored) {}

            // Fallback: plain-text match for legacy students (auto-migrate)
            if (!passwordMatches && request.getPassword().equals(student.getPassword())) {
                // Re-hash and save for future logins
                student.setPassword(passwordEncoder.encode(request.getPassword()));
                studentRepository.save(student);
                passwordMatches = true;
            }

            if (!passwordMatches) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Wrong password!"));
            }

            if ("inactive".equals(student.getStatus())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Account deactivated. Contact admin!"));
            }

            String token = jwtUtil.generateToken(student.getEmail(), "student");

            return ResponseEntity.ok(new LoginResponse(
                token,
                "student",
                student.getFirstName() + " " + student.getLastName(),
                student.getEmail(),
                student.getId()
            ));
        }

        // ── Mentor Login ──
        if ("mentor".equals(role)) {
            Optional<Mentor> mentorOpt = mentorRepository.findByEmail(request.getEmail());

            if (mentorOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email not found!"));
            }

            Mentor mentor = mentorOpt.get();

            if (!"Mentor@123".equals(request.getPassword())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Wrong password!"));
            }

            String token = jwtUtil.generateToken(mentor.getEmail(), "mentor");

            return ResponseEntity.ok(new LoginResponse(
                token,
                "mentor",
                mentor.getName(),
                mentor.getEmail(),
                mentor.getId()
            ));
        }

        // ── Admin Login ──
        if ("admin".equals(role)) {
            Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());

            if (adminOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid credentials!"));
            }

            Admin admin = adminOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Wrong password!"));
            }

            String token = jwtUtil.generateToken(admin.getEmail(), "admin");

            return ResponseEntity.ok(new LoginResponse(
                token,
                "admin",
                admin.getName(),
                admin.getEmail(),
                admin.getId()
            ));
        }

        return ResponseEntity.badRequest()
            .body(Map.of("message", "Invalid role!"));
    }

    // ── Validate Token ──
    @GetMapping("/validate")
    public ResponseEntity<?> validate(
        @RequestHeader("Authorization") String authHeader
    ) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", jwtUtil.getEmailFromToken(token),
                    "role",  jwtUtil.getRoleFromToken(token)
                ));
            }
        }
        return ResponseEntity.badRequest()
            .body(Map.of("valid", false));
    }

    // ── OTP Store & DTOs ──
    private static class OtpData {
        String otp;
        long expiryTime;
        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    // ── Forgot Password: Send OTP ──
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required!"));
        }

        Optional<Student> studentOpt = studentRepository.findByEmail(email.trim());
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Student email not found!"));
        }

        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        long expiry = System.currentTimeMillis() + (10 * 60 * 1000); // 10 mins expiry
        otpStore.put(email.trim().toLowerCase(), new OtpData(otp, expiry));

        System.out.println("==================================================");
        System.out.println("OTP for " + email + ": " + otp);
        System.out.println("==================================================");

        boolean emailSent = false;
        String emailErrorMsg = null;

        if (mailSender != null) {
            try {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                if (mailFrom != null && !mailFrom.trim().isEmpty()) {
                    mailMessage.setFrom(mailFrom.trim());
                } else {
                    mailMessage.setFrom("umacode7@gmail.com");
                }
                mailMessage.setTo(email.trim());
                mailMessage.setSubject("NexAcademy - Student Password Reset OTP");
                mailMessage.setText(
                    "Hello,\n\n" +
                    "Your 6-digit OTP code for NexAcademy student password reset is: " + otp + "\n\n" +
                    "This OTP is valid for 10 minutes. Do not share this OTP with anyone.\n\n" +
                    "Best regards,\n" +
                    "NexAcademy Team"
                );
                mailSender.send(mailMessage);
                emailSent = true;
                System.out.println("✅ Email sent successfully to " + email);
            } catch (Exception ex) {
                emailErrorMsg = ex.getMessage();
                System.err.println("❌ Could not send email via SMTP: " + ex.getMessage());
                ex.printStackTrace();
            }
        } else {
            System.err.println("❌ mailSender is NULL! MailSender bean was not autowired.");
        }

        return ResponseEntity.ok(Map.of(
            "message", emailSent ? "OTP sent to your email inbox!" : "OTP generated! (Note: SMTP mail delivery encountered an issue: " + (emailErrorMsg != null ? emailErrorMsg : "MailSender unavailable") + ")",
            "otp", otp,
            "emailSent", emailSent
        ));
    }

    // ── Forgot Password: Verify OTP ──
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required!"));
        }

        OtpData storedData = otpStore.get(email.trim().toLowerCase());
        if (storedData == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "No OTP requested for this email. Please click Resend OTP!"));
        }

        if (System.currentTimeMillis() > storedData.expiryTime) {
            otpStore.remove(email.trim().toLowerCase());
            return ResponseEntity.badRequest().body(Map.of("message", "OTP expired! Please click Resend OTP."));
        }

        if (!storedData.otp.equals(otp.trim())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP! Please check and enter correct OTP."));
        }

        return ResponseEntity.ok(Map.of("message", "OTP verified successfully!"));
    }

    // ── Forgot Password: Reset Password & Auto-Login ──
    @PostMapping("/forgot-password/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        if (email == null || otp == null || newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required!"));
        }

        OtpData storedData = otpStore.get(email.trim().toLowerCase());
        if (storedData == null || !storedData.otp.equals(otp.trim()) || System.currentTimeMillis() > storedData.expiryTime) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP session! Please try again."));
        }

        Optional<Student> studentOpt = studentRepository.findByEmail(email.trim());
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Student email not found!"));
        }

        Student student = studentOpt.get();
        student.setPassword(passwordEncoder.encode(newPassword.trim()));
        studentRepository.save(student);

        // Clear OTP store
        otpStore.remove(email.trim().toLowerCase());

        // Generate JWT token & return LoginResponse for immediate dashboard redirect
        String token = jwtUtil.generateToken(student.getEmail(), "student");

        return ResponseEntity.ok(new LoginResponse(
            token,
            "student",
            student.getFirstName() + " " + student.getLastName(),
            student.getEmail(),
            student.getId()
        ));
    }
}