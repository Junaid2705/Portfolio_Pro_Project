// PATH: src/main/java/com/example/portfolio_pro/model/Project.java

package com.example.portfolio_pro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "tech_stack", length = 500)
    private String techStack;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "live_link", length = 300)
    private String liveLink;

    @Column(name = "github_link", length = 300)
    private String githubLink;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Project() {}

    // Getters
    public Long getId()                  { return id; }
    public Portfolio getPortfolio()      { return portfolio; }
    public String getTitle()             { return title; }
    public String getDescription()       { return description; }
    public String getTechStack()         { return techStack; }
    public String getImageUrl()          { return imageUrl; }
    public String getLiveLink()          { return liveLink; }
    public String getGithubLink()        { return githubLink; }
    public Integer getDisplayOrder()     { return displayOrder; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }

    // Setters
    public void setId(Long id)                        { this.id = id; }
    public void setPortfolio(Portfolio portfolio)     { this.portfolio = portfolio; }
    public void setTitle(String title)                { this.title = title; }
    public void setDescription(String description)    { this.description = description; }
    public void setTechStack(String techStack)        { this.techStack = techStack; }
    public void setImageUrl(String imageUrl)          { this.imageUrl = imageUrl; }
    public void setLiveLink(String liveLink)          { this.liveLink = liveLink; }
    public void setGithubLink(String githubLink)      { this.githubLink = githubLink; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
