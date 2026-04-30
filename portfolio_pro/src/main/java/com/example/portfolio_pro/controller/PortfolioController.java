// PATH: src/main/java/com/example/portfolio_pro/controller/PortfolioController.java
// UPDATED: Added public projects endpoint

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.dto.PortfolioRequest;
import com.example.portfolio_pro.dto.PortfolioResponse;
import com.example.portfolio_pro.dto.ProjectResponse;
import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.Skill;
import com.example.portfolio_pro.repository.PortfolioRepository;
import com.example.portfolio_pro.repository.ProjectRepository;
import com.example.portfolio_pro.repository.SkillRepository;
import com.example.portfolio_pro.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService    portfolioService;
    private final PortfolioRepository portfolioRepository;
    private final SkillRepository     skillRepository;
    private final ProjectRepository   projectRepository;

    public PortfolioController(PortfolioService portfolioService,
                               PortfolioRepository portfolioRepository,
                               SkillRepository skillRepository,
                               ProjectRepository projectRepository) {
        this.portfolioService    = portfolioService;
        this.portfolioRepository = portfolioRepository;
        this.skillRepository     = skillRepository;
        this.projectRepository   = projectRepository;
    }

    // GET /api/portfolio/my
    @GetMapping("/my")
    public ResponseEntity<PortfolioResponse> getMyPortfolio() {
        return ResponseEntity.ok(portfolioService.getMyPortfolio());
    }

    // POST /api/portfolio/create
    @PostMapping("/create")
    public ResponseEntity<PortfolioResponse> createPortfolio(
            @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.createPortfolio(request));
    }

    // PUT /api/portfolio/update
    @PutMapping("/update")
    public ResponseEntity<PortfolioResponse> updatePortfolio(
            @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.updatePortfolio(request));
    }

    // PUT /api/portfolio/publish
    @PutMapping("/publish")
    public ResponseEntity<PortfolioResponse> publishPortfolio() {
        return ResponseEntity.ok(portfolioService.publishPortfolio());
    }

    // GET /api/portfolio/public/{slug} — public, no auth
    @GetMapping("/public/{slug}")
    public ResponseEntity<PortfolioResponse> getPublicPortfolio(
            @PathVariable String slug) {
        Portfolio portfolio = portfolioRepository.findByPublicUrlSlug(slug)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        if (portfolio.getStatus() != Portfolio.Status.PUBLISHED) {
            throw new RuntimeException("This portfolio is not published yet.");
        }

        // Increment views
        portfolio.setViewsCount(portfolio.getViewsCount() + 1);
        portfolioRepository.save(portfolio);

        List<Skill> skills = skillRepository
                .findByPortfolioOrderByDisplayOrderAsc(portfolio);
        return ResponseEntity.ok(new PortfolioResponse(portfolio, skills));
    }

    // GET /api/portfolio/public/{slug}/projects — public projects list
    @GetMapping("/public/{slug}/projects")
    public ResponseEntity<List<ProjectResponse>> getPublicProjects(
            @PathVariable String slug) {
        Portfolio portfolio = portfolioRepository.findByPublicUrlSlug(slug)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        if (portfolio.getStatus() != Portfolio.Status.PUBLISHED) {
            throw new RuntimeException("Portfolio not published");
        }

        List<ProjectResponse> projects = projectRepository
                .findByPortfolioOrderByDisplayOrderAsc(portfolio)
                .stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(projects);
    }
}
