// PATH: src/main/java/com/example/portfolio_pro/controller/PasswordResetController.java
// FIX 3: Forgot password flow (token based, no email server needed for dev)

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.model.User;
import com.example.portfolio_pro.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // In-memory token store: token -> email (for dev)
    // In production, store in DB with expiry
    private final Map<String, String> resetTokens = new ConcurrentHashMap<>();

    public PasswordResetController(UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST /api/auth/forgot-password
    // Body: { "email": "user@example.com" }
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody Map<String, String> body) {

        String email = body.get("email");
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) {
            // Don't reveal if email exists — security best practice
            return ResponseEntity.ok(Map.of(
                "message", "If this email is registered, a reset token will be shown.",
                "token", "" // empty for non-existent emails
            ));
        }

        // Generate token
        String token = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        resetTokens.put(token, email.trim());

        // In production: send email with link
        // For dev: return token directly so you can test
        return ResponseEntity.ok(Map.of(
            "message", "Reset token generated. Use this token to reset your password.",
            "token", token,  // Show in dev — remove in production
            "note", "In production this would be sent via email"
        ));
    }

    // POST /api/auth/reset-password
    // Body: { "token": "ABC12345", "newPassword": "newpass123" }
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> body) {

        String token       = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || token.isBlank())
            throw new RuntimeException("Token is required");
        if (newPassword == null || newPassword.length() < 6)
            throw new RuntimeException("Password must be at least 6 characters");

        String email = resetTokens.get(token.trim().toUpperCase());
        if (email == null) {
            throw new RuntimeException("Invalid or expired token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Remove used token
        resetTokens.remove(token.trim().toUpperCase());

        return ResponseEntity.ok(Map.of("message", "Password reset successfully. Please login."));
    }
}
