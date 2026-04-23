// PATH: src/main/java/com/example/portfolio_pro/repository/PortfolioRepository.java

package com.example.portfolio_pro.repository;

import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByUser(User user);
    Optional<Portfolio> findByPublicUrlSlug(String slug);
    boolean existsByPublicUrlSlug(String slug);
}
