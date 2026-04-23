-- ============================================================
--  PORTFOLIO PRO — MySQL Database Schema v1.0
--  Run this entire file in MySQL Workbench or CLI
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_pro;
USE portfolio_pro;

-- ============================================================
-- TABLE 1: users
-- Stores both Admin and Portfolio User accounts
-- ============================================================
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,            -- BCrypt hashed
    role        ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    status      ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 2: portfolios
-- One portfolio per user (one-to-one relationship)
-- ============================================================
CREATE TABLE portfolios (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(150),                   -- "John's Portfolio"
    bio             TEXT,
    designation     VARCHAR(100),                   -- "Full Stack Developer"
    profile_image   VARCHAR(500),                   -- File path or URL
    resume_url      VARCHAR(500),
    github_url      VARCHAR(300),
    linkedin_url    VARCHAR(300),
    website_url     VARCHAR(300),
    theme           VARCHAR(50) DEFAULT 'default',
    public_url_slug VARCHAR(100) UNIQUE,            -- e.g. "john-doe"
    status          ENUM('DRAFT', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    views_count     INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE 3: projects
-- Each portfolio can have many projects
-- ============================================================
CREATE TABLE projects (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id    BIGINT NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    tech_stack      VARCHAR(500),                   -- "React, Spring Boot, MySQL"
    image_url       VARCHAR(500),
    live_link       VARCHAR(300),
    github_link     VARCHAR(300),
    display_order   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE 4: skills
-- Skills listed on the portfolio
-- ============================================================
CREATE TABLE skills (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id    BIGINT NOT NULL,
    skill_name      VARCHAR(100) NOT NULL,
    level           ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') DEFAULT 'INTERMEDIATE',
    category        VARCHAR(100),                   -- "Frontend", "Backend", "Database"
    display_order   INT DEFAULT 0,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE 5: contact_messages
-- Messages sent via the portfolio contact form
-- ============================================================
CREATE TABLE contact_messages (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id    BIGINT NOT NULL,
    sender_name     VARCHAR(100) NOT NULL,
    sender_email    VARCHAR(150) NOT NULL,
    message         TEXT NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE 6: themes
-- Admin-controlled list of available themes
-- ============================================================
CREATE TABLE themes (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    theme_key       VARCHAR(50) NOT NULL UNIQUE,   -- "default", "dark", "minimal"
    display_name    VARCHAR(100) NOT NULL,
    thumbnail_url   VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA — Default admin user + themes
-- Password: Admin@123 (BCrypt hash below)
-- ============================================================
INSERT INTO users (name, email, password, role, status) VALUES
('Admin', 'admin@portfoliopro.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lN1i', 'ADMIN', 'ACTIVE');

INSERT INTO themes (theme_key, display_name, is_active) VALUES
('default',  'Classic Blue',   TRUE),
('dark',     'Dark Mode',      TRUE),
('minimal',  'Clean Minimal',  TRUE),
('creative', 'Bold Creative',  TRUE);

-- ============================================================
-- VERIFY: Run these SELECT statements to confirm setup
-- ============================================================
SELECT * FROM users;
SELECT * FROM themes;
