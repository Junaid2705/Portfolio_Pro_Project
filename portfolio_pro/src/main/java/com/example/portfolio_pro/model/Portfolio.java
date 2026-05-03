// PATH: src/main/java/com/example/portfolio_pro/model/Portfolio.java

package com.example.portfolio_pro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolios")
public class Portfolio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(length = 150)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String bio;

	@Column(length = 100)
	private String designation;

	

	@Column(name = "github_url", length = 300)
	private String githubUrl;

	@Column(name = "linkedin_url", length = 300)
	private String linkedinUrl;

	@Column(name = "website_url", length = 300)
	private String websiteUrl;

	@Column(length = 50)
	private String theme = "default";

	@Column(name = "public_url_slug", length = 100, unique = true)
	private String publicUrlSlug;

	@Enumerated(EnumType.STRING)
	private Status status = Status.DRAFT;

	@Column(name = "views_count")
	private Integer viewsCount = 0;

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	@Column(name = "updated_at")
	private LocalDateTime updatedAt = LocalDateTime.now();

	public enum Status {
		DRAFT, PUBLISHED, REJECTED
	}

	// Default constructor
	public Portfolio() {
	}

	// Getters
	public Long getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public String getTitle() {
		return title;
	}

	public String getBio() {
		return bio;
	}

	public String getDesignation() {
		return designation;
	}

	

	public String getGithubUrl() {
		return githubUrl;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public String getWebsiteUrl() {
		return websiteUrl;
	}

	public String getTheme() {
		return theme;
	}

	public String getPublicUrlSlug() {
		return publicUrlSlug;
	}

	public Status getStatus() {
		return status;
	}

	public Integer getViewsCount() {
		return viewsCount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	// Setters
	public void setId(Long id) {
		this.id = id;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	

	public void setGithubUrl(String githubUrl) {
		this.githubUrl = githubUrl;
	}

	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}

	public void setWebsiteUrl(String websiteUrl) {
		this.websiteUrl = websiteUrl;
	}

	public void setTheme(String theme) {
		this.theme = theme;
	}

	public void setPublicUrlSlug(String slug) {
		this.publicUrlSlug = slug;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public void setViewsCount(Integer viewsCount) {
		this.viewsCount = viewsCount;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@Lob
	@Column(columnDefinition = "LONGTEXT")
	private String profileImage;

	// Make sure to generate the Getter and Setter for this!
	public String getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
}
