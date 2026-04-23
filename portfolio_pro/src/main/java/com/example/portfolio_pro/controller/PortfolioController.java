// PATH: src/main/java/com/example/portfolio_pro/controller/PortfolioController.java

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.dto.PortfolioRequest;
import com.example.portfolio_pro.dto.PortfolioResponse;
import com.example.portfolio_pro.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // GET  /api/portfolio/my  — get logged-in user's portfolio
    @GetMapping("/my")
    public ResponseEntity<PortfolioResponse> getMyPortfolio() {
        return ResponseEntity.ok(portfolioService.getMyPortfolio());
    }

    // POST /api/portfolio/create  — create new portfolio
    @PostMapping("/create")
    public ResponseEntity<PortfolioResponse> createPortfolio(
            @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.createPortfolio(request));
    }

    // PUT  /api/portfolio/update  — update existing portfolio
    @PutMapping("/update")
    public ResponseEntity<PortfolioResponse> updatePortfolio(
            @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.updatePortfolio(request));
    }

    // PUT  /api/portfolio/publish  — toggle published/draft
    @PutMapping("/publish")
    public ResponseEntity<PortfolioResponse> publishPortfolio() {
        return ResponseEntity.ok(portfolioService.publishPortfolio());
    }
}
