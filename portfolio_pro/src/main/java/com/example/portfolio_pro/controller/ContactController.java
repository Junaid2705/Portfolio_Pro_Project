// PATH: src/main/java/com/example/portfolio_pro/controller/ContactController.java
// FIX 2: Correct endpoint — POST /api/contact/{slug}

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.dto.ContactRequest;
import com.example.portfolio_pro.model.ContactMessage;
import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.repository.ContactMessageRepository;
import com.example.portfolio_pro.repository.PortfolioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageRepository messageRepository;
    private final PortfolioRepository portfolioRepository;

    public ContactController(ContactMessageRepository messageRepository,
                             PortfolioRepository portfolioRepository) {
        this.messageRepository   = messageRepository;
        this.portfolioRepository = portfolioRepository;
    }

    // POST /api/contact/{slug} — public, no auth needed
    @PostMapping("/{slug}")
    public ResponseEntity<Map<String, String>> sendMessage(
            @PathVariable String slug,
            @RequestBody ContactRequest request) {

        Portfolio portfolio = portfolioRepository.findByPublicUrlSlug(slug)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        if (portfolio.getStatus() != Portfolio.Status.PUBLISHED) {
            throw new RuntimeException("Cannot send message to unpublished portfolio");
        }

        // Validate
        if (request.getSenderName() == null || request.getSenderName().isBlank())
            throw new RuntimeException("Name is required");
        if (request.getSenderEmail() == null || request.getSenderEmail().isBlank())
            throw new RuntimeException("Email is required");
        if (request.getMessage() == null || request.getMessage().isBlank())
            throw new RuntimeException("Message is required");

        ContactMessage msg = new ContactMessage();
        msg.setPortfolio(portfolio);
        msg.setSenderName(request.getSenderName().trim());
        msg.setSenderEmail(request.getSenderEmail().trim());
        msg.setMessage(request.getMessage().trim());
        msg.setIsRead(false);

        messageRepository.save(msg);

        return ResponseEntity.ok(Map.of("message", "Message sent successfully!"));
    }
}
