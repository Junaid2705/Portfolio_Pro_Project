package com.example.portfolio_pro.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    
// Add these below your existing fields (like password, role, etc.)
    
    @Column(name = "reset_token")
    private String resetToken; // We will store the 6-digit OTP here

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry; // When the OTP expires

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    public String getResetToken() {
		return resetToken;
	}

	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
	}

	public LocalDateTime getResetTokenExpiry() {
		return resetTokenExpiry;
	}

	public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
		this.resetTokenExpiry = resetTokenExpiry;
	}
	// ... your existing resetToken fields ...

    // --- Layout Customization Fields ---
    private String themeColor = "#6366f1"; // Default purple/indigo color
    private String backgroundColor = "#1a1a2e"; // Default dark background
    private String fontFamily = "Inter, sans-serif"; // Default font

    // --- Getters and Setters for the new fields ---
    public String getThemeColor() { return themeColor; }
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; }

    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }
	@Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role   { ADMIN, USER }
    public enum Status { ACTIVE, INACTIVE, PENDING }

    // Default constructor (required by JPA)
    public User() {}

    // Getters
    public Long getId()               { return id; }
    public String getName()           { return name; }
    public String getEmail()          { return email; }
    public String getPassword()       { return password; }
    public Role getRole()             { return role; }
    public Status getStatus()         { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id)               { this.id = id; }
    public void setName(String name)         { this.name = name; }
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(Role role)           { this.role = role; }
    public void setStatus(Status status)     { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
