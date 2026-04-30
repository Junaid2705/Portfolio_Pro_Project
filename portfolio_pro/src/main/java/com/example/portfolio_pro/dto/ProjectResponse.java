// PATH: src/main/java/com/example/portfolio_pro/dto/ProjectResponse.java

package com.example.portfolio_pro.dto;

import com.example.portfolio_pro.model.Project;
import java.time.LocalDateTime;

public class ProjectResponse {
    private Long id;
    private Long portfolioId;
    private String title;
    private String description;
    private String techStack;
    private String imageUrl;
    private String liveLink;
    private String githubLink;
    private Integer displayOrder;
    private LocalDateTime createdAt;

    public ProjectResponse(Project p) {
        this.id           = p.getId();
        this.portfolioId  = p.getPortfolio().getId();
        this.title        = p.getTitle();
        this.description  = p.getDescription();
        this.techStack    = p.getTechStack();
        this.imageUrl     = p.getImageUrl();
        this.liveLink     = p.getLiveLink();
        this.githubLink   = p.getGithubLink();
        this.displayOrder = p.getDisplayOrder();
        this.createdAt    = p.getCreatedAt();
    }

    public Long getId()              { return id; }
    public Long getPortfolioId()     { return portfolioId; }
    public String getTitle()         { return title; }
    public String getDescription()   { return description; }
    public String getTechStack()     { return techStack; }
    public String getImageUrl()      { return imageUrl; }
    public String getLiveLink()      { return liveLink; }
    public String getGithubLink()    { return githubLink; }
    public Integer getDisplayOrder() { return displayOrder; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
