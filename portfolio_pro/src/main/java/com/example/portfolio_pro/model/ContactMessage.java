// PATH: src/main/java/com/example/portfolio_pro/model/ContactMessage.java

package com.example.portfolio_pro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(name = "sender_name", nullable = false, length = 100)
    private String senderName;

    @Column(name = "sender_email", nullable = false, length = 150)
    private String senderEmail;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ContactMessage() {}

    // Getters
    public Long getId()                 { return id; }
    public Portfolio getPortfolio()     { return portfolio; }
    public String getSenderName()       { return senderName; }
    public String getSenderEmail()      { return senderEmail; }
    public String getMessage()          { return message; }
    public Boolean getIsRead()          { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id)                        { this.id = id; }
    public void setPortfolio(Portfolio portfolio)      { this.portfolio = portfolio; }
    public void setSenderName(String senderName)       { this.senderName = senderName; }
    public void setSenderEmail(String senderEmail)     { this.senderEmail = senderEmail; }
    public void setMessage(String message)             { this.message = message; }
    public void setIsRead(Boolean isRead)              { this.isRead = isRead; }
    public void setCreatedAt(LocalDateTime createdAt)  { this.createdAt = createdAt; }
}
