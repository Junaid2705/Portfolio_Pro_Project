// PATH: src/main/java/com/example/portfolio_pro/dto/PortfolioRequest.java

package com.example.portfolio_pro.dto;

import java.util.List;

public class PortfolioRequest {

    private String title;
    private String bio;
    private String designation;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String theme;
    private String publicUrlSlug;
    private List<SkillDto> skills;

    public PortfolioRequest() {}

    // Inner SkillDto
    public static class SkillDto {
        private String skillName;
        private String level;
        private String category;

        public SkillDto() {}
        public String getSkillName()             { return skillName; }
        public void setSkillName(String s)       { this.skillName = s; }
        public String getLevel()                 { return level; }
        public void setLevel(String l)           { this.level = l; }
        public String getCategory()              { return category; }
        public void setCategory(String c)        { this.category = c; }
    }

    // Getters & Setters
    public String getTitle()                        { return title; }
    public void setTitle(String title)              { this.title = title; }
    public String getBio()                          { return bio; }
    public void setBio(String bio)                  { this.bio = bio; }
    public String getDesignation()                  { return designation; }
    public void setDesignation(String d)            { this.designation = d; }
    public String getGithubUrl()                    { return githubUrl; }
    public void setGithubUrl(String u)              { this.githubUrl = u; }
    public String getLinkedinUrl()                  { return linkedinUrl; }
    public void setLinkedinUrl(String u)            { this.linkedinUrl = u; }
    public String getWebsiteUrl()                   { return websiteUrl; }
    public void setWebsiteUrl(String u)             { this.websiteUrl = u; }
    public String getTheme()                        { return theme; }
    public void setTheme(String theme)              { this.theme = theme; }
    public String getPublicUrlSlug()                { return publicUrlSlug; }
    public void setPublicUrlSlug(String slug)       { this.publicUrlSlug = slug; }
    public List<SkillDto> getSkills()               { return skills; }
    public void setSkills(List<SkillDto> skills)    { this.skills = skills; }
}
