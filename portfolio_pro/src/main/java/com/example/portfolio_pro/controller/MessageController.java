// PATH: src/main/java/com/example/portfolio_pro/controller/MessageController.java

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.model.ContactMessage;
import com.example.portfolio_pro.model.User;
import com.example.portfolio_pro.repository.ContactMessageRepository;
import com.example.portfolio_pro.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final ContactMessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(ContactMessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    // GET /api/messages/my
    @GetMapping("/my")
    public ResponseEntity<List<ContactMessage>> getMyMessages() {
        // 1. Get the currently logged-in user's email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 2. Find the user in the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Fetch all messages and filter ONLY the ones that belong to this user's portfolio
        List<ContactMessage> messages = messageRepository.findAll().stream()
                .filter(msg -> msg.getPortfolio() != null && 
                               msg.getPortfolio().getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(messages);
    }

    // PUT /api/messages/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        // Find the message by ID
        ContactMessage message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Mark it as read and save back to the database
        message.setIsRead(true);
        messageRepository.save(message);

        return ResponseEntity.ok().build();
    }
}