// PATH: src/main/java/com/example/portfolio_pro/dto/ProjectRequest.java

package com.example.portfolio_pro.dto;

public class ProjectRequest {
    private String title;
    private String description;
    private String techStack;
    private String imageUrl;
    private String liveLink;
    private String githubLink;
    private Integer displayOrder;

    public ProjectRequest() {}

    public String getTitle()               { return title; }
    public void setTitle(String t)         { this.title = t; }
    public String getDescription()         { return description; }
    public void setDescription(String d)   { this.description = d; }
    public String getTechStack()           { return techStack; }
    public void setTechStack(String t)     { this.techStack = t; }
    public String getImageUrl()            { return imageUrl; }
    public void setImageUrl(String u)      { this.imageUrl = u; }
    public String getLiveLink()            { return liveLink; }
    public void setLiveLink(String l)      { this.liveLink = l; }
    public String getGithubLink()          { return githubLink; }
    public void setGithubLink(String g)    { this.githubLink = g; }
    public Integer getDisplayOrder()       { return displayOrder; }
    public void setDisplayOrder(Integer o) { this.displayOrder = o; }
}
