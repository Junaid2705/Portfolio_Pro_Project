package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.model.User;
import com.example.portfolio_pro.repository.UserRepository;
import com.example.portfolio_pro.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;


import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth") // Or "/api/password" depending on your route setup
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

 // 1. Request the OTP
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotRequest request) { // <--- Changed here
        String email = request.getEmail(); // <--- Changed here
        
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "If an account with that email exists, an OTP has been sent."));
        }

        User user = userOpt.get();

        // Generate a random 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Set OTP and Expiration (Valid for 15 minutes)
        user.setResetToken(otp);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send the email!
        emailService.sendOtpEmail(user.getEmail(), otp);

        return ResponseEntity.ok(Map.of("message", "If an account with that email exists, an OTP has been sent."));
    }

    // 2. Verify OTP and Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetRequest request) {
    	
    	System.out.println("🚨 FORGOT PASSWORD ENDPOINT WAS HIT! Email: " + request.getEmail());
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request."));
        }

        User user = userOpt.get();

        // Check if OTP matches
        if (user.getResetToken() == null || !user.getResetToken().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or incorrect OTP."));
        }

        // Check if OTP has expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP has expired. Please request a new one."));
        }

        // Success! Encrypt and save the new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // Clear the OTP fields so they can't be used again
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password has been successfully reset!"));
    }

    // Simple DTO class to handle the incoming JSON for resetting the password
    public static class ResetRequest {
        private String email;
        private String otp;
        private String newPassword;

        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
    
 // Simple DTO to safely catch the email from React
    public static class ForgotRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}