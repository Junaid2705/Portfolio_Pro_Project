// PATH: src/main/java/com/example/portfolio_pro/service/ProjectService.java

package com.example.portfolio_pro.service;

import com.example.portfolio_pro.dto.ProjectRequest;
import com.example.portfolio_pro.dto.ProjectResponse;
import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.Project;
import com.example.portfolio_pro.model.User;
import com.example.portfolio_pro.repository.PortfolioRepository;
import com.example.portfolio_pro.repository.ProjectRepository;
import com.example.portfolio_pro.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          PortfolioRepository portfolioRepository,
                          UserRepository userRepository) {
        this.projectRepository   = projectRepository;
        this.portfolioRepository = portfolioRepository;
        this.userRepository      = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Portfolio getMyPortfolio() {
        User user = getCurrentUser();
        return portfolioRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found. Create one first."));
    }

    // GET all projects for current user
    public List<ProjectResponse> getMyProjects() {
        Portfolio portfolio = getMyPortfolio();
        return projectRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio)
                .stream().map(ProjectResponse::new).collect(Collectors.toList());
    }

    // POST create new project
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Portfolio portfolio = getMyPortfolio();

        Project project = new Project();
        project.setPortfolio(portfolio);
        mapToProject(request, project);

        // Auto set display order
        List<Project> existing = projectRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        project.setDisplayOrder(existing.size());

        projectRepository.save(project);
        return new ProjectResponse(project);
    }

    // PUT update project
    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest request) {
        Portfolio portfolio = getMyPortfolio();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Security: make sure project belongs to this user's portfolio
        if (!project.getPortfolio().getId().equals(portfolio.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        mapToProject(request, project);
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
        return new ProjectResponse(project);
    }

    // DELETE project
    @Transactional
    public void deleteProject(Long projectId) {
        Portfolio portfolio = getMyPortfolio();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getPortfolio().getId().equals(portfolio.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        projectRepository.delete(project);
    }

    private void mapToProject(ProjectRequest req, Project p) {
        if (req.getTitle()        != null) p.setTitle(req.getTitle());
        if (req.getDescription()  != null) p.setDescription(req.getDescription());
        if (req.getTechStack()    != null) p.setTechStack(req.getTechStack());
        if (req.getImageUrl()     != null) p.setImageUrl(req.getImageUrl());
        if (req.getLiveLink()     != null) p.setLiveLink(req.getLiveLink());
        if (req.getGithubLink()   != null) p.setGithubLink(req.getGithubLink());
        if (req.getDisplayOrder() != null) p.setDisplayOrder(req.getDisplayOrder());
    }
}
