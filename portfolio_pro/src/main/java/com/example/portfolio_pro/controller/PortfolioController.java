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
import com.example.portfolio_pro.repository.UserRepository;
import com.example.portfolio_pro.service.PortfolioService;
import com.example.portfolio_pro.model.User;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

	private final PortfolioService   portfolioService;
    private final PortfolioRepository portfolioRepository;
    private final SkillRepository     skillRepository;
    private final ProjectRepository   projectRepository;
    private final UserRepository      userRepository; // <-- Added here

    public PortfolioController(PortfolioService portfolioService,
                               PortfolioRepository portfolioRepository,
                               SkillRepository skillRepository,
                               ProjectRepository projectRepository,
                               UserRepository userRepository) { // <-- Added here
        this.portfolioService    = portfolioService;
        this.portfolioRepository = portfolioRepository;
        this.skillRepository     = skillRepository;
        this.projectRepository   = projectRepository;
        this.userRepository      = userRepository; // <-- Added here
    
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
    
 // ==========================================
    // --- Layout Customization Endpoints ---
    // ==========================================

    @PutMapping("/layout")
    public ResponseEntity<?> updateLayout(@RequestBody LayoutRequest request) {
        // Find the user by email (we will send this from React)
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found."));
        }

        User user = userOpt.get();

        // Update their preferences
        user.setThemeColor(request.getThemeColor());
        user.setBackgroundColor(request.getBackgroundColor());
        user.setFontFamily(request.getFontFamily());

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Layout updated successfully!"));
    }

    // DTO to safely catch the incoming layout data from React
    public static class LayoutRequest {
        private String email;
        private String themeColor;
        private String backgroundColor;
        private String fontFamily;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getThemeColor() { return themeColor; }
        public void setThemeColor(String themeColor) { this.themeColor = themeColor; }
        public String getBackgroundColor() { return backgroundColor; }
        public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }
        public String getFontFamily() { return fontFamily; }
        public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }
    }
}
