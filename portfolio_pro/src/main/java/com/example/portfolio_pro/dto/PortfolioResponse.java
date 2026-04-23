// PATH: src/main/java/com/example/portfolio_pro/dto/PortfolioResponse.java

package com.example.portfolio_pro.dto;

import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.Skill;
import java.util.List;
import java.util.stream.Collectors;

public class PortfolioResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String title;
    private String bio;
    private String designation;
    private String profileImage;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String theme;
    private String publicUrlSlug;
    private String status;
    private Integer viewsCount;
    private List<SkillDto> skills;

    public static class SkillDto {
        private Long id;
        private String skillName;
        private String level;
        private String category;

        public SkillDto(Skill s) {
            this.id        = s.getId();
            this.skillName = s.getSkillName();
            this.level     = s.getLevel().name();
            this.category  = s.getCategory();
        }
        public Long getId()          { return id; }
        public String getSkillName() { return skillName; }
        public String getLevel()     { return level; }
        public String getCategory()  { return category; }
    }

    // Build from entity + skills list
    public PortfolioResponse(Portfolio p, List<Skill> skills) {
        this.id             = p.getId();
        this.userId         = p.getUser().getId();
        this.userName       = p.getUser().getName();
        this.userEmail      = p.getUser().getEmail();
        this.title          = p.getTitle();
        this.bio            = p.getBio();
        this.designation    = p.getDesignation();
        this.profileImage   = p.getProfileImage();
        this.githubUrl      = p.getGithubUrl();
        this.linkedinUrl    = p.getLinkedinUrl();
        this.websiteUrl     = p.getWebsiteUrl();
        this.theme          = p.getTheme();
        this.publicUrlSlug  = p.getPublicUrlSlug();
        this.status         = p.getStatus().name();
        this.viewsCount     = p.getViewsCount();
        this.skills         = skills.stream().map(SkillDto::new).collect(Collectors.toList());
    }

    // Getters
    public Long getId()              { return id; }
    public Long getUserId()          { return userId; }
    public String getUserName()      { return userName; }
    public String getUserEmail()     { return userEmail; }
    public String getTitle()         { return title; }
    public String getBio()           { return bio; }
    public String getDesignation()   { return designation; }
    public String getProfileImage()  { return profileImage; }
    public String getGithubUrl()     { return githubUrl; }
    public String getLinkedinUrl()   { return linkedinUrl; }
    public String getWebsiteUrl()    { return websiteUrl; }
    public String getTheme()         { return theme; }
    public String getPublicUrlSlug() { return publicUrlSlug; }
    public String getStatus()        { return status; }
    public Integer getViewsCount()   { return viewsCount; }
    public List<SkillDto> getSkills(){ return skills; }
}
