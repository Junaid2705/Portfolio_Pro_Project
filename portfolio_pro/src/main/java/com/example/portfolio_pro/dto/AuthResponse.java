package com.example.portfolio_pro.dto;

public class AuthResponse {

    private String token;
    private String role;
    private String name;
    private String email;
    private Long userId;

    // Constructor used in AuthService
    public AuthResponse(String token, String role, String name, String email, Long userId) {
        this.token  = token;
        this.role   = role;
        this.name   = name;
        this.email  = email;
        this.userId = userId;
    }

    public String getToken()           { return token; }
    public String getRole()            { return role; }
    public String getName()            { return name; }
    public String getEmail()           { return email; }
    public Long getUserId()            { return userId; }

    public void setToken(String token)   { this.token = token; }
    public void setRole(String role)     { this.role = role; }
    public void setName(String name)     { this.name = name; }
    public void setEmail(String email)   { this.email = email; }
    public void setUserId(Long userId)   { this.userId = userId; }
}
