<?php
/**
 * Database Auto-Installer & Seeder for Luxury Portfolio CMS
 */

header('Content-Type: application/json; charset=utf-8');

const DB_HOST = 'localhost';
const DB_NAME = 'portfolio_db';
const DB_USER = 'root';
const DB_PASS = '';

try {
    // 1. Connect to MySQL server
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    // 2. Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `" . DB_NAME . "`;");

    // 3. Drop old tables in proper order to prevent stale constraints
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $tablesToDrop = [
        'project_images', 'projects', 'skills', 'skill_categories', 'profile', 
        'experience', 'messages', 'media', 'analytics', 'activity_logs', 'settings', 'admins'
    ];
    foreach ($tablesToDrop as $tbl) {
        $pdo->exec("DROP TABLE IF EXISTS `{$tbl}`;");
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // 4. Create Tables
    $pdo->exec("
        CREATE TABLE `admins` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `email` VARCHAR(150) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `role` VARCHAR(50) DEFAULT 'Super Admin',
            `avatar_url` VARCHAR(255) DEFAULT 'assets/images/default-avatar.png',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `profile` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `full_name` VARCHAR(100) NOT NULL DEFAULT 'DAIZY MAGPANTAY',
            `professional_title` VARCHAR(150) NOT NULL DEFAULT 'IT STUDENT — EXPLORING SYSTEMS, DESIGN & TECHNOLOGY',
            `short_intro` TEXT,
            `about_me` TEXT,
            `location` VARCHAR(100) DEFAULT 'Philippines',
            `focus_areas` VARCHAR(150) DEFAULT 'Systems • Web • Design',
            `current_status` VARCHAR(150) DEFAULT 'Studying Information Technology',
            `email` VARCHAR(150) DEFAULT 'daizymagpantay@gmail.com',
            `phone` VARCHAR(50) DEFAULT '+63 912 345 6789',
            `linkedin_url` VARCHAR(255) DEFAULT 'https://linkedin.com/in/daizymagpantay',
            `github_url` VARCHAR(255) DEFAULT 'https://github.com/daizymagpantay',
            `other_socials_json` JSON,
            `availability_status_json` JSON,
            `avatar_url` VARCHAR(255) DEFAULT 'assets/images/portrait-cinematic.svg',
            `hero_badge` VARCHAR(100) DEFAULT 'PORTFOLIO / 2026',
            `resume_url` VARCHAR(255) DEFAULT '',
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `skill_categories` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `slug` VARCHAR(100) NOT NULL UNIQUE,
            `sort_order` INT DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `skills` (
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

        CREATE TABLE `projects` (
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

        CREATE TABLE `project_images` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `project_id` INT NOT NULL,
            `image_url` VARCHAR(255) NOT NULL,
            `caption` VARCHAR(255) DEFAULT '',
            `sort_order` INT DEFAULT 0,
            FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `experience` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `year` VARCHAR(20) NOT NULL,
            `title` VARCHAR(150) NOT NULL,
            `description` TEXT NOT NULL,
            `category` VARCHAR(100) DEFAULT 'Milestone',
            `sort_order` INT DEFAULT 0,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `messages` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `sender_name` VARCHAR(100) NOT NULL,
            `email` VARCHAR(150) NOT NULL,
            `subject` VARCHAR(200) DEFAULT 'Portfolio Inquiry',
            `message` TEXT NOT NULL,
            `status` ENUM('Unread', 'Read', 'Replied') DEFAULT 'Unread',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `media` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `filename` VARCHAR(255) NOT NULL,
            `file_path` VARCHAR(255) NOT NULL,
            `file_size` INT DEFAULT 0,
            `file_type` VARCHAR(100) DEFAULT 'image/png',
            `caption` VARCHAR(255) DEFAULT '',
            `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `analytics` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `page_path` VARCHAR(255) NOT NULL,
            `visitor_ip` VARCHAR(100) DEFAULT '',
            `user_agent` VARCHAR(255) DEFAULT '',
            `referrer` VARCHAR(255) DEFAULT '',
            `viewed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `activity_logs` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `admin_id` INT DEFAULT NULL,
            `admin_name` VARCHAR(100) DEFAULT 'System',
            `action_type` VARCHAR(100) NOT NULL,
            `description` VARCHAR(255) NOT NULL,
            `ip_address` VARCHAR(100) DEFAULT '',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE `settings` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `setting_key` VARCHAR(100) NOT NULL UNIQUE,
            `setting_value` TEXT,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 5. Seed Admin
    $passHash = password_hash('admin123', PASSWORD_DEFAULT);
    $insertAdmin = $pdo->prepare("INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
    $insertAdmin->execute([
        'Daizy Magpantay',
        'admin@portfolio.com',
        $passHash,
        'Super Administrator'
    ]);

    // 6. Seed Profile
    $otherSocials = json_encode([
        ['platform' => 'Instagram', 'url' => 'https://instagram.com/daizymagpantay', 'icon' => 'instagram'],
        ['platform' => 'Behance', 'url' => 'https://behance.net/daizymagpantay', 'icon' => 'palette'],
        ['platform' => 'Discord', 'url' => 'https://discord.com', 'icon' => 'message-square']
    ]);

    $availability = json_encode([
        'School Projects',
        'Web Projects',
        'System Projects',
        'Creative Collaborations'
    ]);

    $insertProfile = $pdo->prepare("INSERT INTO profile (
        full_name, professional_title, short_intro, about_me, location, focus_areas, current_status, 
        email, phone, linkedin_url, github_url, other_socials_json, availability_status_json, 
        avatar_url, hero_badge
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $insertProfile->execute([
        'DAIZY MAGPANTAY',
        'IT STUDENT — EXPLORING SYSTEMS, DESIGN & TECHNOLOGY',
        'I\'m an Information Technology student exploring systems, web technology, digital design, and emerging technologies.',
        'I\'m an Information Technology student interested in turning ideas and real-world problems into practical digital solutions. Combining modern frontend interfaces with robust backend architectures, I focus on clean structure, intuitive interaction, and efficient database designs.',
        'Philippines',
        'Systems • Web • Design',
        'Studying Information Technology',
        'daizymagpantay@gmail.com',
        '+63 912 345 6789',
        'https://linkedin.com/in/daizymagpantay',
        'https://github.com/daizymagpantay',
        $otherSocials,
        $availability,
        'assets/images/portrait-cinematic.svg',
        'PORTFOLIO / 2026'
    ]);

    // 7. Seed Skill Categories
    $categories = [
        ['name' => 'SYSTEM DEVELOPMENT', 'slug' => 'system-development', 'order' => 1],
        ['name' => 'WEB TECHNOLOGY', 'slug' => 'web-technology', 'order' => 2],
        ['name' => 'DIGITAL DESIGN', 'slug' => 'digital-design', 'order' => 3],
        ['name' => 'DATABASE', 'slug' => 'database', 'order' => 4],
        ['name' => 'DEVELOPMENT TOOLS', 'slug' => 'development-tools', 'order' => 5],
        ['name' => 'AI / EMERGING TECHNOLOGY', 'slug' => 'ai-emerging-technology', 'order' => 6],
    ];

    $insertCat = $pdo->prepare("INSERT INTO skill_categories (name, slug, sort_order) VALUES (?, ?, ?)");
    $catIds = [];
    foreach ($categories as $cat) {
        $insertCat->execute([$cat['name'], $cat['slug'], $cat['order']]);
        $catIds[$cat['slug']] = $pdo->lastInsertId();
    }

    $skills = [
        // SYSTEM DEVELOPMENT
        ['category_id' => $catIds['system-development'], 'name' => 'PHP', 'description' => 'Server-side logic, session handling & secure REST APIs', 'icon_name' => 'server', 'order' => 1],
        ['category_id' => $catIds['system-development'], 'name' => 'System Architecture', 'description' => 'Modular MVC structuring and data-flow modeling', 'icon_name' => 'cpu', 'order' => 2],
        ['category_id' => $catIds['system-development'], 'name' => 'API Integration', 'description' => 'RESTful endpoints, JSON exchange & token validation', 'icon_name' => 'link', 'order' => 3],
        ['category_id' => $catIds['system-development'], 'name' => 'Authentication & RBAC', 'description' => 'Role-based access control, hashing & protected routes', 'icon_name' => 'shield-check', 'order' => 4],

        // WEB TECHNOLOGY
        ['category_id' => $catIds['web-technology'], 'name' => 'HTML5 / Modern CSS', 'description' => 'Semantic layout, animations & glassmorphic aesthetics', 'icon_name' => 'file-code', 'order' => 1],
        ['category_id' => $catIds['web-technology'], 'name' => 'JavaScript (ES6+)', 'description' => 'Async/await, DOM reactivity, fetch API & events', 'icon_name' => 'code-2', 'order' => 2],
        ['category_id' => $catIds['web-technology'], 'name' => 'Vue.js 3', 'description' => 'Reactive components, Vue Router SPA architecture & state', 'icon_name' => 'layout', 'order' => 3],
        ['category_id' => $catIds['web-technology'], 'name' => 'Tailwind CSS', 'description' => 'Utility-first styling, dark luxury theming & responsive UI', 'icon_name' => 'palette', 'order' => 4],

        // DIGITAL DESIGN
        ['category_id' => $catIds['digital-design'], 'name' => 'Figma', 'description' => 'High-fidelity UI mockups, design systems & prototypes', 'icon_name' => 'figma', 'order' => 1],
        ['category_id' => $catIds['digital-design'], 'name' => 'UI / UX Design', 'description' => 'User journey mapping, wireframing & interaction design', 'icon_name' => 'monitor', 'order' => 2],
        ['category_id' => $catIds['digital-design'], 'name' => 'Glassmorphism & Lighting', 'description' => 'Ambient lighting, floating cards & luxury palettes', 'icon_name' => 'sparkles', 'order' => 3],

        // DATABASE
        ['category_id' => $catIds['database'], 'name' => 'MySQL', 'description' => 'Relational database design, indexes & constraints', 'icon_name' => 'database', 'order' => 1],
        ['category_id' => $catIds['database'], 'name' => 'PDO & Prepared Statements', 'description' => 'SQL injection prevention & safe queries', 'icon_name' => 'lock', 'order' => 2],
        ['category_id' => $catIds['database'], 'name' => 'Data Modeling', 'description' => 'ERD schema planning, foreign keys & normalization', 'icon_name' => 'layers', 'order' => 3],

        // DEVELOPMENT TOOLS
        ['category_id' => $catIds['development-tools'], 'name' => 'Git / GitHub', 'description' => 'Version control, branching & repository workflow', 'icon_name' => 'git-branch', 'order' => 1],
        ['category_id' => $catIds['development-tools'], 'name' => 'XAMPP Stack', 'description' => 'Apache, MySQL, and local PHP development environment', 'icon_name' => 'hard-drive', 'order' => 2],
        ['category_id' => $catIds['development-tools'], 'name' => 'VS Code', 'description' => 'Modern editor setup, debugging & extensions', 'icon_name' => 'terminal', 'order' => 3],

        // AI / EMERGING TECHNOLOGY
        ['category_id' => $catIds['ai-emerging-technology'], 'name' => 'AI Prompt Engineering', 'description' => 'Context-aware prompting, structured outputs & system instructions', 'icon_name' => 'bot', 'order' => 1],
        ['category_id' => $catIds['ai-emerging-technology'], 'name' => 'Computer Vision Basics', 'description' => 'Object recognition principles & visual model integration', 'icon_name' => 'eye', 'order' => 2],
        ['category_id' => $catIds['ai-emerging-technology'], 'name' => 'LLM API Integration', 'description' => 'Connecting generative models into web apps for smart workflows', 'icon_name' => 'zap', 'order' => 3],
    ];

    $insertSkill = $pdo->prepare("INSERT INTO skills (category_id, name, description, icon_name, is_visible, sort_order) VALUES (?, ?, ?, ?, 1, ?)");
    foreach ($skills as $s) {
        $insertSkill->execute([$s['category_id'], $s['name'], $s['description'], $s['icon_name'], $s['order']]);
    }

    // 8. Seed Projects
    $projects = [
        [
            'project_number' => '01',
            'title' => 'NCST e-Docs',
            'slug' => 'ncst-e-docs',
            'short_description' => 'Digital Certificate Request & Verification System',
            'full_description' => 'A centralized institutional platform engineered to streamline the end-to-end request, processing, verification, and issuance of academic certificates and official school credentials. Features QR-based authenticity verification and automated multi-stage administrative approvals.',
            'category' => 'System Design & Web App',
            'year' => '2026',
            'role' => 'Lead Full-Stack Developer & UI/UX Designer',
            'technologies_json' => json_encode(['UI/UX', 'WEB APP', 'SYSTEM DESIGN']),
            'cover_image' => 'assets/images/project-edocs.svg',
            'github_url' => 'https://github.com/daizymagpantay/ncst-edocs',
            'project_url' => '#',
            'is_featured' => 1,
            'status' => 'Published',
            'problem' => 'Traditional physical certificate requests resulted in long queue times, high paperwork overhead, delayed verification from external employers, and high risk of document tampering.',
            'solution' => 'Engineered a secure web portal where students can submit credential requests with online tracking. Administrators process requests with digital signature validation and generate tamper-proof documents embedded with dynamic cryptographic QR verification codes.',
            'my_contribution' => 'Architected the relational database schema, built the custom administrative management dashboard, implemented secure PDF generation with dynamic QR stamps, and styled the dark editorial interface.',
            'views_count' => 142,
            'sort_order' => 1
        ],
        [
            'project_number' => '02',
            'title' => 'SariSmart',
            'slug' => 'sarismart',
            'short_description' => 'AI-Based Product Recognition & Retail Management',
            'full_description' => 'An intelligent retail management solution tailored for neighborhood sari-sari stores in the Philippines. Integrates visual computer vision to rapidly recognize inventory items, log daily sales, automate stock replenishment alerts, and provide financial insights.',
            'category' => 'AI & Retail Management',
            'year' => '2025',
            'role' => 'Full-Stack Developer & AI Interface Specialist',
            'technologies_json' => json_encode(['AI', 'WEB APP', 'RETAIL']),
            'cover_image' => 'assets/images/project-sarismart.svg',
            'github_url' => 'https://github.com/daizymagpantay/sarismart',
            'project_url' => '#',
            'is_featured' => 1,
            'status' => 'Published',
            'problem' => 'Micro-retail store owners often manage inventory through manual logbooks, suffering from untracked credit (utang), unrecorded sales, stockouts of high-demand items, and lack of visual sales tracking.',
            'solution' => 'Delivered an ultra-fast, camera-assisted web terminal that identifies items placed in front of the lens, instantly tallies checkout carts, syncs inventory levels, and visualizes revenue trends.',
            'my_contribution' => 'Designed the mobile-first kiosk interface, connected the frontend with product recognition endpoints, programmed the real-time stock alert system, and structured the transactional database.',
            'views_count' => 98,
            'sort_order' => 2
        ],
        [
            'project_number' => '03',
            'title' => 'Student Assistance Management',
            'slug' => 'student-assistance-management',
            'short_description' => 'Academic Support, Duty Scheduling & Allowance Disbursement Portal',
            'full_description' => 'A comprehensive workflow management system for university scholarship and student assistant programs. Automates duty roster scheduling, biometric time tracking logging, evaluation scoring, and automated stipend disbursement calculation.',
            'category' => 'System Design & Scheduling',
            'year' => '2025',
            'role' => 'Backend Developer & Database Architect',
            'technologies_json' => json_encode(['SYSTEM DESIGN', 'SCHEDULING', 'WEB APP']),
            'cover_image' => 'assets/images/project-assistance.svg',
            'github_url' => 'https://github.com/daizymagpantay/student-assistance-mgmt',
            'project_url' => '#',
            'is_featured' => 1,
            'status' => 'Published',
            'problem' => 'Campus offices struggled with scheduling conflicts among student assistants, manual calculation of completed duty hours, delayed allowances, and lost paper timecards.',
            'solution' => 'Created an integrated duty scheduling engine that prevents timetable clashes with enrolled class hours, logs verified attendance, and generates detailed stipend payroll reports in one click.',
            'my_contribution' => 'Authored the conflict-free scheduling algorithm, designed the administrator approval workflow, built real-time notifications for duty updates, and normalized the SQL schema.',
            'views_count' => 84,
            'sort_order' => 3
        ]
    ];

    $insertProj = $pdo->prepare("INSERT INTO projects (
        project_number, title, slug, short_description, full_description, category, year, role, 
        technologies_json, cover_image, github_url, project_url, is_featured, status, 
        problem, solution, my_contribution, views_count, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $insertProjImg = $pdo->prepare("INSERT INTO project_images (project_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)");

    foreach ($projects as $p) {
        $insertProj->execute([
            $p['project_number'], $p['title'], $p['slug'], $p['short_description'], $p['full_description'],
            $p['category'], $p['year'], $p['role'], $p['technologies_json'], $p['cover_image'],
            $p['github_url'], $p['project_url'], $p['is_featured'], $p['status'],
            $p['problem'], $p['solution'], $p['my_contribution'], $p['views_count'], $p['sort_order']
        ]);
        $projId = $pdo->lastInsertId();

        $insertProjImg->execute([$projId, 'assets/images/screenshot-1.svg', 'Administrative Control Dashboard', 1]);
        $insertProjImg->execute([$projId, 'assets/images/screenshot-2.svg', 'Request Processing & Verification Portal', 2]);
        $insertProjImg->execute([$projId, 'assets/images/screenshot-3.svg', 'Analytics & Real-Time Reporting View', 3]);
    }

    // 9. Seed Experience
    $experiences = [
        [
            'year' => '2026',
            'title' => 'Web Development',
            'description' => 'Projects & System Development with modern web frameworks, secure relational databases, and high-contrast editorial UI.',
            'category' => 'System & Web Development',
            'sort_order' => 1
        ],
        [
            'year' => '2025',
            'title' => 'Digital Design',
            'description' => 'Interface Design & Prototyping in Figma, interactive design systems, and visual microinteractions.',
            'category' => 'Interface Design',
            'sort_order' => 2
        ],
        [
            'year' => '2024',
            'title' => 'Started IT Journey',
            'description' => 'Exploration of computer science foundations, algorithms, modern web development, and digital system architectures.',
            'category' => 'Foundation',
            'sort_order' => 3
        ],
    ];

    $insertExp = $pdo->prepare("INSERT INTO experience (year, title, description, category, sort_order) VALUES (?, ?, ?, ?, ?)");
    foreach ($experiences as $e) {
        $insertExp->execute([$e['year'], $e['title'], $e['description'], $e['category'], $e['sort_order']]);
    }

    // 10. Seed Settings
    $defaultSettings = [
        'accent_color' => '#F28C28',
        'accent_highlight' => '#FFB347',
        'site_title' => 'DAIZY MAGPANTAY — Portfolio & Admin CMS',
        'site_status' => 'online',
        'show_skills' => '1',
        'show_experience' => '1',
        'show_philosophy' => '1',
        'show_markers' => '1',
        'enable_contact_form' => '1',
        'visitor_count' => '420',
        'maintenance_mode' => '0'
    ];

    $insertSet = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)");
    foreach ($defaultSettings as $key => $val) {
        $insertSet->execute([$key, $val]);
    }

    // 11. Seed Activity Logs
    $insertLog = $pdo->prepare("INSERT INTO activity_logs (admin_id, admin_name, action_type, description, ip_address) VALUES (?, ?, ?, ?, ?)");
    $insertLog->execute([1, 'Daizy Magpantay', 'SYSTEM_SETUP', 'Portfolio database initialized and seeded successfully.', '127.0.0.1']);
    $insertLog->execute([1, 'Daizy Magpantay', 'PROJECT_PUBLISH', 'Project "NCST e-Docs" published to showcase.', '127.0.0.1']);
    $insertLog->execute([1, 'Daizy Magpantay', 'PROJECT_PUBLISH', 'Project "SariSmart" published to showcase.', '127.0.0.1']);
    $insertLog->execute([1, 'Daizy Magpantay', 'SKILL_UPDATE', 'Core toolkit categories and skills populated.', '127.0.0.1']);

    // 12. Seed Sample Message
    $insertMsg = $pdo->prepare("INSERT INTO messages (sender_name, email, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
    $insertMsg->execute([
        'Tech Innovations Inc.',
        'collaborate@techinnovations.ph',
        'Web System Collaboration Inquiry',
        'Hello Daizy, we came across your portfolio and we are extremely impressed by your NCST e-Docs and SariSmart projects. We would love to discuss a potential system development collaboration.',
        'Unread'
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Database portfolio_db initialized and seeded successfully with all tables and luxury portfolio data!',
        'default_admin' => [
            'email' => 'admin@portfolio.com',
            'password' => 'admin123'
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database setup failed: ' . $e->getMessage()
    ]);
}
