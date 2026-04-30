// PATH: src/main/java/com/example/portfolio_pro/dto/UserResponse.java

package com.example.portfolio_pro.dto;

import com.example.portfolio_pro.model.User;
import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String status;
    private LocalDateTime createdAt;

    public UserResponse(User u) {
        this.id        = u.getId();
        this.name      = u.getName();
        this.email     = u.getEmail();
        this.role      = u.getRole().name();
        this.status    = u.getStatus().name();
        this.createdAt = u.getCreatedAt();
    }

    public Long getId()                  { return id; }
    public String getName()              { return name; }
    public String getEmail()             { return email; }
    public String getRole()              { return role; }
    public String getStatus()            { return status; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
}
