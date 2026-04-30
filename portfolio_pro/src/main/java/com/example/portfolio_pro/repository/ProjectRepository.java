// PATH: src/main/java/com/example/portfolio_pro/repository/ProjectRepository.java

package com.example.portfolio_pro.repository;

import com.example.portfolio_pro.model.Portfolio;
import com.example.portfolio_pro.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByPortfolioOrderByDisplayOrderAsc(Portfolio portfolio);
    void deleteByPortfolio(Portfolio portfolio);
}
