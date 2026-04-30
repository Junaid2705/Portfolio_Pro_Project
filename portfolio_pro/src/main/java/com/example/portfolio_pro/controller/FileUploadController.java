// PATH: src/main/java/com/example/portfolio_pro/controller/FileUploadController.java
// FIX 1: Profile image upload endpoint

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.User;
import com.example.portfolio_pro.repository.PortfolioRepository;
import com.example.portfolio_pro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;

    // Files stored in uploads/ folder in project root
    private final String uploadDir = "uploads/";

    public FileUploadController(UserRepository userRepository,
                                PortfolioRepository portfolioRepository) {
        this.userRepository      = userRepository;
        this.portfolioRepository = portfolioRepository;
    }

    // POST /api/upload/profile-image
    @PostMapping("/profile-image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null ||
            (!contentType.equals("image/jpeg") &&
             !contentType.equals("image/png") &&
             !contentType.equals("image/webp"))) {
            throw new RuntimeException("Only JPG, PNG, WEBP images are allowed");
        }

        // Validate size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("Image must be less than 5MB");
        }

        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String ext = contentType.equals("image/png") ? ".png"
                   : contentType.equals("image/webp") ? ".webp" : ".jpg";
        String filename = UUID.randomUUID().toString() + ext;
        Path filePath = uploadPath.resolve(filename);

        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // URL to access the image
        String imageUrl = "http://localhost:8080/uploads/" + filename;

        // Update portfolio profile image
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        portfolioRepository.findByUser(user).ifPresent(portfolio -> {
            portfolio.setProfileImage(imageUrl);
            portfolioRepository.save(portfolio);
        });

        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }
}
