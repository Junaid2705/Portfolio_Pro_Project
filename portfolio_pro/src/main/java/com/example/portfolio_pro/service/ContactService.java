// PATH: src/main/java/com/example/portfolio_pro/service/ContactService.java

package com.example.portfolio_pro.service;

import com.example.portfolio_pro.dto.ContactRequest;
import com.example.portfolio_pro.model.ContactMessage;
import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.repository.ContactMessageRepository;
import com.example.portfolio_pro.repository.PortfolioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final PortfolioRepository portfolioRepository;

    public ContactService(ContactMessageRepository contactMessageRepository,
                          PortfolioRepository portfolioRepository) {
        this.contactMessageRepository = contactMessageRepository;
        this.portfolioRepository      = portfolioRepository;
    }

    // POST — visitor sends message to portfolio owner
    @Transactional
    public Map<String, String> sendMessage(String slug, ContactRequest request) {
        Portfolio portfolio = portfolioRepository.findByPublicUrlSlug(slug)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        if (portfolio.getStatus() != Portfolio.Status.PUBLISHED) {
            throw new RuntimeException("Cannot send message to unpublished portfolio");
        }

        if (request.getSenderName() == null || request.getSenderName().isBlank()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getSenderEmail() == null || request.getSenderEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new RuntimeException("Message is required");
        }

        ContactMessage msg = new ContactMessage();
        msg.setPortfolio(portfolio);
        msg.setSenderName(request.getSenderName());
        msg.setSenderEmail(request.getSenderEmail());
        msg.setMessage(request.getMessage());
        msg.setIsRead(false);

        contactMessageRepository.save(msg);
        return Map.of("message", "Message sent successfully!");
    }
}
