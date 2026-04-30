// PATH: src/main/java/com/example/portfolio_pro/service/AdminService.java

package com.example.portfolio_pro.service;

import com.example.portfolio_pro.dto.PortfolioResponse;
import com.example.portfolio_pro.dto.UserResponse;
import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.Skill;
import com.example.portfolio_pro.model.User;
import com.example.portfolio_pro.repository.ContactMessageRepository;
import com.example.portfolio_pro.repository.PortfolioRepository;
import com.example.portfolio_pro.repository.SkillRepository;
import com.example.portfolio_pro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final SkillRepository skillRepository;
    private final ContactMessageRepository messageRepository;

    public AdminService(UserRepository userRepository,
                        PortfolioRepository portfolioRepository,
                        SkillRepository skillRepository,
                        ContactMessageRepository messageRepository) {
        this.userRepository      = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.skillRepository     = skillRepository;
        this.messageRepository   = messageRepository;
    }

    // ── Dashboard Stats ──
    public Map<String, Object> getDashboardStats() {
        long totalUsers      = userRepository.count();
        long totalPortfolios = portfolioRepository.count();
        long published       = portfolioRepository.findAll().stream()
                .filter(p -> p.getStatus() == Portfolio.Status.PUBLISHED).count();
        long totalMessages   = messageRepository.count();

        return Map.of(
            "totalUsers",      totalUsers,
            "totalPortfolios", totalPortfolios,
            "publishedPortfolios", published,
            "totalMessages",   totalMessages
        );
    }

    // ── User Management ──
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream().map(UserResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot change admin status");
        }

        user.setStatus(user.getStatus() == User.Status.ACTIVE
                ? User.Status.INACTIVE
                : User.Status.ACTIVE);

        userRepository.save(user);
        return new UserResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot delete admin");
        }
        userRepository.delete(user);
    }

    // ── Portfolio Management ──
    public List<PortfolioResponse> getAllPortfolios() {
        return portfolioRepository.findAll().stream().map(p -> {
            List<Skill> skills = skillRepository.findByPortfolioOrderByDisplayOrderAsc(p);
            return new PortfolioResponse(p, skills);
        }).collect(Collectors.toList());
    }

    @Transactional
    public PortfolioResponse approvePortfolio(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        portfolio.setStatus(Portfolio.Status.PUBLISHED);
        portfolioRepository.save(portfolio);
        List<Skill> skills = skillRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        return new PortfolioResponse(portfolio, skills);
    }

    @Transactional
    public PortfolioResponse rejectPortfolio(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        portfolio.setStatus(Portfolio.Status.REJECTED);
        portfolioRepository.save(portfolio);
        List<Skill> skills = skillRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        return new PortfolioResponse(portfolio, skills);
    }
}
