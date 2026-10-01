-- Database Schema for Luxury Cinematic Portfolio & Admin CMS
-- Database Name: portfolio_db

CREATE DATABASE IF NOT EXISTS `portfolio_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `portfolio_db`;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) DEFAULT 'Super Admin',
    `avatar_url` VARCHAR(255) DEFAULT 'assets/images/default-avatar.svg',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Profile Table
CREATE TABLE IF NOT EXISTS `profile` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL DEFAULT 'DAIZY MAGPANTAY',
    `professional_title` VARCHAR(150) NOT NULL DEFAULT 'IT STUDENT — EXPLORING SYSTEMS, DESIGN & TECHNOLOGY',
    `short_intro` TEXT,
    `about_me` TEXT,
    `location` VARCHAR(100) DEFAULT 'Philippines',
    `focus_areas` VARCHAR(150) DEFAULT 'Systems • Web • Design',
    `current_status` VARCHAR(150) DEFAULT 'Studying Information Technology',
    `email` VARCHAR(150) DEFAULT 'daizymagpantay@gmail.com',
    `phone` VARCHAR(50) DEFAULT '+63 900 000 0000',
    `linkedin_url` VARCHAR(255) DEFAULT 'https://linkedin.com/in/daizymagpantay',
    `github_url` VARCHAR(255) DEFAULT 'https://github.com/daizymagpantay',
    `other_socials_json` JSON,
    `availability_status_json` JSON,
    `avatar_url` VARCHAR(255) DEFAULT 'assets/images/portrait-cinematic.svg',
    `hero_badge` VARCHAR(100) DEFAULT 'PORTFOLIO / 2026',
    `resume_url` VARCHAR(255) DEFAULT '',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Skill Categories Table
CREATE TABLE IF NOT EXISTS `skill_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS `skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) DEFAULT '',
    `icon_name` VARCHAR(50) DEFAULT 'code',
    `is_visible` TINYINT(1) DEFAULT 1,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `skill_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_number` VARCHAR(20) DEFAULT '01',
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `short_description` TEXT,
    `full_description` LONGTEXT,
    `category` VARCHAR(100) DEFAULT 'Web Application',
    `year` VARCHAR(20) DEFAULT '2026',
    `role` VARCHAR(100) DEFAULT 'Lead Developer & UI Designer',
    `technologies_json` JSON,
    `cover_image` VARCHAR(255) DEFAULT 'assets/images/project-default.png',
    `github_url` VARCHAR(255) DEFAULT '',
    `project_url` VARCHAR(255) DEFAULT '',
    `is_featured` TINYINT(1) DEFAULT 1,
    `status` ENUM('Published', 'Draft') DEFAULT 'Published',
    `problem` LONGTEXT,
    `solution` LONGTEXT,
    `my_contribution` LONGTEXT,
    `views_count` INT DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Project Images Table
CREATE TABLE IF NOT EXISTS `project_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `caption` VARCHAR(255) DEFAULT '',
    `sort_order` INT DEFAULT 0,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Experience / Journey Table
CREATE TABLE IF NOT EXISTS `experience` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `year` VARCHAR(20) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(100) DEFAULT 'Milestone',
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Messages Table
CREATE TABLE IF NOT EXISTS `messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `subject` VARCHAR(200) DEFAULT 'Portfolio Inquiry',
    `message` TEXT NOT NULL,
    `status` ENUM('Unread', 'Read', 'Replied') DEFAULT 'Unread',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Media Library Table
CREATE TABLE IF NOT EXISTS `media` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_size` INT DEFAULT 0,
    `file_type` VARCHAR(100) DEFAULT 'image/png',
    `caption` VARCHAR(255) DEFAULT '',
    `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Analytics Table
CREATE TABLE IF NOT EXISTS `analytics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `page_path` VARCHAR(255) NOT NULL,
    `visitor_ip` VARCHAR(100) DEFAULT '',
    `user_agent` VARCHAR(255) DEFAULT '',
    `referrer` VARCHAR(255) DEFAULT '',
    `viewed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Activity Logs Table
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT DEFAULT NULL,
    `admin_name` VARCHAR(100) DEFAULT 'System',
    `action_type` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `ip_address` VARCHAR(100) DEFAULT '',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
