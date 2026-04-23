// PATH: src/main/java/com/example/portfolio_pro/repository/SkillRepository.java

package com.example.portfolio_pro.repository;

import com.example.portfolio_pro.model.Skill;
import com.example.portfolio_pro.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByPortfolioOrderByDisplayOrderAsc(Portfolio portfolio);
    void deleteByPortfolio(Portfolio portfolio);
}
