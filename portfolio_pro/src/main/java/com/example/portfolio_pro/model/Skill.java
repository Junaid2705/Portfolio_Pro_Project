// PATH: src/main/java/com/example/portfolio_pro/model/Skill.java

package com.example.portfolio_pro.model;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Enumerated(EnumType.STRING)
    private Level level = Level.INTERMEDIATE;

    @Column(length = 100)
    private String category;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public enum Level { BEGINNER, INTERMEDIATE, ADVANCED, EXPERT }

    public Skill() {}

    // Getters
    public Long getId()               { return id; }
    public Portfolio getPortfolio()   { return portfolio; }
    public String getSkillName()      { return skillName; }
    public Level getLevel()           { return level; }
    public String getCategory()       { return category; }
    public Integer getDisplayOrder()  { return displayOrder; }

    // Setters
    public void setId(Long id)                    { this.id = id; }
    public void setPortfolio(Portfolio portfolio)  { this.portfolio = portfolio; }
    public void setSkillName(String skillName)     { this.skillName = skillName; }
    public void setLevel(Level level)              { this.level = level; }
    public void setCategory(String category)       { this.category = category; }
    public void setDisplayOrder(Integer order)     { this.displayOrder = order; }
}
