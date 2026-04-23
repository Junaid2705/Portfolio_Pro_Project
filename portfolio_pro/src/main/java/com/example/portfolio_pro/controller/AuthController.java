// PATH: src/main/java/com/example/portfolio_pro/controller/AuthController.java
// FIXED: Removed @CrossOrigin — CORS is now handled globally in SecurityConfig

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.dto.AuthResponse;
import com.example.portfolio_pro.dto.LoginRequest;
import com.example.portfolio_pro.dto.RegisterRequest;
import com.example.portfolio_pro.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
