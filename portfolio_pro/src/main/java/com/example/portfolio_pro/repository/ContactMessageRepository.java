// PATH: src/main/java/com/example/portfolio_pro/repository/ContactMessageRepository.java

package com.example.portfolio_pro.repository;

import com.example.portfolio_pro.model.ContactMessage;
import com.example.portfolio_pro.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByPortfolioOrderByCreatedAtDesc(Portfolio portfolio);
    long countByPortfolioAndIsRead(Portfolio portfolio, Boolean isRead);
}
