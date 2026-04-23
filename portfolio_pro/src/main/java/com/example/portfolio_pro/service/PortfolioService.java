// PATH: src/main/java/com/example/portfolio_pro/service/PortfolioService.java

package com.example.portfolio_pro.service;

import com.example.portfolio_pro.dto.PortfolioRequest;
import com.example.portfolio_pro.dto.PortfolioResponse;
import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.Skill;
import com.example.portfolio_pro.model.User;
import com.example.portfolio_pro.repository.PortfolioRepository;
import com.example.portfolio_pro.repository.SkillRepository;
import com.example.portfolio_pro.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public PortfolioService(PortfolioRepository portfolioRepository,
                            SkillRepository skillRepository,
                            UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.skillRepository     = skillRepository;
        this.userRepository      = userRepository;
    }

    // Get currently logged-in user from JWT
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/portfolio/my — get current user's portfolio
    public PortfolioResponse getMyPortfolio() {
        User user = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found. Please create one."));
        List<Skill> skills = skillRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        return new PortfolioResponse(portfolio, skills);
    }

    // POST /api/portfolio/create — create new portfolio
    @Transactional
    public PortfolioResponse createPortfolio(PortfolioRequest request) {
        User user = getCurrentUser();

        // Check if portfolio already exists
        if (portfolioRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Portfolio already exists. Use update instead.");
        }

        // Validate slug uniqueness
        if (request.getPublicUrlSlug() != null && !request.getPublicUrlSlug().isBlank()) {
            if (portfolioRepository.existsByPublicUrlSlug(request.getPublicUrlSlug())) {
                throw new RuntimeException("This URL slug is already taken. Try another.");
            }
        }

        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);
        mapRequestToPortfolio(request, portfolio);
        portfolioRepository.save(portfolio);

        // Save skills
        List<Skill> skills = saveSkills(request, portfolio);
        return new PortfolioResponse(portfolio, skills);
    }

    // PUT /api/portfolio/update — update existing portfolio
    @Transactional
    public PortfolioResponse updatePortfolio(PortfolioRequest request) {
        User user = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        // Check slug uniqueness only if changed
        if (request.getPublicUrlSlug() != null
                && !request.getPublicUrlSlug().equals(portfolio.getPublicUrlSlug())) {
            if (portfolioRepository.existsByPublicUrlSlug(request.getPublicUrlSlug())) {
                throw new RuntimeException("This URL slug is already taken. Try another.");
            }
        }

        mapRequestToPortfolio(request, portfolio);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);

        // Replace all skills
        skillRepository.deleteByPortfolio(portfolio);
        List<Skill> skills = saveSkills(request, portfolio);
        return new PortfolioResponse(portfolio, skills);
    }

    // PUT /api/portfolio/publish — toggle PUBLISHED/DRAFT
    @Transactional
    public PortfolioResponse publishPortfolio() {
        User user = getCurrentUser();
        Portfolio portfolio = portfolioRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        if (portfolio.getPublicUrlSlug() == null || portfolio.getPublicUrlSlug().isBlank()) {
            throw new RuntimeException("Please set a public URL slug before publishing.");
        }

        portfolio.setStatus(
            portfolio.getStatus() == Portfolio.Status.PUBLISHED
                ? Portfolio.Status.DRAFT
                : Portfolio.Status.PUBLISHED
        );
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);

        List<Skill> skills = skillRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        return new PortfolioResponse(portfolio, skills);
    }

    // Helper — map request fields to portfolio entity
    private void mapRequestToPortfolio(PortfolioRequest req, Portfolio p) {
        if (req.getTitle()         != null) p.setTitle(req.getTitle());
        if (req.getBio()           != null) p.setBio(req.getBio());
        if (req.getDesignation()   != null) p.setDesignation(req.getDesignation());
        if (req.getGithubUrl()     != null) p.setGithubUrl(req.getGithubUrl());
        if (req.getLinkedinUrl()   != null) p.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getWebsiteUrl()    != null) p.setWebsiteUrl(req.getWebsiteUrl());
        if (req.getTheme()         != null) p.setTheme(req.getTheme());
        if (req.getPublicUrlSlug() != null) p.setPublicUrlSlug(req.getPublicUrlSlug());
    }

    // Helper — save skills list
    private List<Skill> saveSkills(PortfolioRequest req, Portfolio portfolio) {
        List<Skill> saved = new ArrayList<>();
        if (req.getSkills() == null) return saved;
        int order = 0;
        for (PortfolioRequest.SkillDto dto : req.getSkills()) {
            Skill skill = new Skill();
            skill.setPortfolio(portfolio);
            skill.setSkillName(dto.getSkillName());
            skill.setCategory(dto.getCategory());
            skill.setDisplayOrder(order++);
            try {
                skill.setLevel(Skill.Level.valueOf(dto.getLevel().toUpperCase()));
            } catch (Exception e) {
                skill.setLevel(Skill.Level.INTERMEDIATE);
            }
            saved.add(skillRepository.save(skill));
        }
        return saved;
    }
}
