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
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    // Manual constructor instead of @RequiredArgsConstructor
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
