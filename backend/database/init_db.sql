-- Tạo database
DROP DATABASE IF EXISTS uniswap_db;
CREATE DATABASE uniswap_db;
USE uniswap_db;

-- 1. BẢNG NGƯỜI DÙNG (USERS)
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    age INT,
    status VARCHAR(255),
    avatar TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    credits_earned DECIMAL(10,2) DEFAULT 5.00,
    credits_spent DECIMAL(10,2) DEFAULT 0.00,
    skills_offered JSON,
    skills_needed JSON,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    -- Chuỗi dưới đây là mã bcrypt của mật khẩu '123456'. 
    -- Ai đăng nhập bằng Google thì không cần pass, ai thích gõ tay thì gõ 123456 là vào.
    password_hash VARCHAR(255) DEFAULT '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG DỊCH VỤ / BÀI ĐĂNG (SERVICES)
CREATE TABLE services (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    credits_per_hour DECIMAL(10,2) NOT NULL,
    duration DECIMAL(5,2) NOT NULL,
    total_credits DECIMAL(10,2) NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. BẢNG ĐẶT LỊCH / GIAO DỊCH (BOOKINGS)
CREATE TABLE bookings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    provider_id INT NOT NULL,
    requester_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    scheduled_date DATETIME NOT NULL,
    message TEXT,
    credits_amount DECIMAL(10,2) NOT NULL,
    credits_settled TINYINT(1) DEFAULT 0, -- Cờ Escrow đã được gom vào đây
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. BẢNG ĐÁNH GIÁ (REVIEWS)
CREATE TABLE reviews (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- BƠM DỮ LIỆU MẪU (MOCK DATA)
-- ==========================================

-- 1. BƠM DỮ LIỆU BẢNG USERS 
INSERT INTO users (email, name, role, age, status, avatar, rating, total_reviews, credits_earned, credits_spent, skills_offered, skills_needed, bio, is_verified) VALUES
('tai.au.cit23@eiu.edu.vn', 'Âu Dương Tài', 'admin', 21, 'Tech Lead / Architect', 'https://ui-avatars.com/api/?name=Au+Duong+Tai&background=0D8ABC&color=fff', 5.0, 99, 999.00, 0.00, '["System Architecture", "React", "Node.js", "MySQL"]', '[]', 'System Administrator of UniSwap. I hold the ultimate power.', TRUE),
('mai.nguyen@eiu.edu.vn', 'Mai Nguyen', 'client', 19, '1st-year Psychology student', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 4.8, 12, 8.00, 6.00, '["English Conversation", "Note-taking", "Study Scheduling", "Social Media"]', '["Statistics Tutoring", "Excel Help", "Research Methods", "SPSS"]', 'I don''t need charity — I just need a fair way to trade what I can do for what I need.', TRUE),
('daniel.tran@eiu.edu.vn', 'Daniel Tran', 'client', 22, '4th-year Computer Science student', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 4.9, 28, 45.00, 12.00, '["Web Development", "Programming Tutoring", "Laptop Repair", "Graphic Design"]', '["Language Tutoring", "Photography", "Public Speaking"]', 'I love helping people — I just want my time to finally count for something.', TRUE),
('sarah.chen@eiu.edu.vn', 'Sarah Chen', 'client', 21, '3rd-year Statistics student', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 4.7, 18, 24.00, 20.00, '["Statistics Tutoring", "Excel Advanced", "SPSS Training", "Data Analysis"]', '["Web Design", "Video Editing", "Photography"]', 'Stats doesn''t have to be scary! Let me help you understand it.', TRUE),
('alex.kim@eiu.edu.vn', 'Alex Kim', 'client', 20, '2nd-year Business student', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 4.6, 15, 18.00, 15.00, '["PowerPoint Design", "Presentation Skills", "Excel Basics", "Resume Writing"]', '["Math Tutoring", "Programming Basics", "Fitness Coaching"]', 'Making presentations that actually look professional.', TRUE);

-- 2. BƠM DỮ LIỆU BẢNG SERVICES
INSERT INTO services (user_id, title, description, category, credits_per_hour, duration, total_credits, image) VALUES
(3, 'Web Development Tutoring - React & HTML/CSS', 'Learn to build modern websites with React. Perfect for beginners! I''ll help you understand the fundamentals and build your first project.', 'Tech & Programming', 2.00, 1.50, 3.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'),
(4, 'Statistics & Research Methods Tutoring', 'Struggling with stats? I can help you understand concepts, work through problems, and prepare for exams. SPSS and Excel included.', 'Academic Tutoring', 2.00, 1.00, 2.00, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'),
(3, 'Laptop & Software Troubleshooting', 'Computer problems? Software issues? I can help diagnose and fix most common problems. Quick and reliable service.', 'Tech & Programming', 2.00, 1.00, 2.00, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=400&fit=crop'),
(5, 'PowerPoint & Presentation Design', 'Make your presentations stand out! I''ll help you create professional slides and improve your delivery skills.', 'Design & Creative', 1.50, 1.00, 1.50, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'),
(2, 'English Conversation Practice', 'Practice your English speaking skills in a friendly, judgment-free environment. Great for building confidence!', 'Language', 1.00, 1.00, 1.00, 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=800&h=400&fit=crop'),
(4, 'Excel Advanced Functions & Data Analysis', 'Master Excel formulas, pivot tables, and data visualization. Perfect for business and research students.', 'Tech & Programming', 2.00, 1.50, 3.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'),
(5, 'Resume & Cover Letter Writing', 'Get your resume noticed by employers. I''ll help you craft a professional CV and compelling cover letter.', 'Career & Professional', 1.50, 1.00, 1.50, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop'),
(3, 'Graphic Design with Figma & Canva', 'Learn to create stunning graphics for social media, presentations, and projects. Beginner-friendly!', 'Design & Creative', 2.00, 1.00, 2.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop');

-- 3. BƠM DỮ LIỆU BẢNG BOOKINGS (Thêm luôn trạng thái credits_settled mẫu)
INSERT INTO bookings (service_id, provider_id, requester_id, status, scheduled_date, message, credits_amount, credits_settled, created_at) VALUES
(2, 4, 2, 'confirmed', '2026-02-05 14:00:00', 'Hi! I really need help with understanding hypothesis testing and p-values for my upcoming exam.', 2.00, 0, '2026-01-28 10:00:00'),
(5, 2, 3, 'completed', '2026-01-29 16:00:00', 'I want to improve my English speaking for an upcoming presentation.', 1.00, 1, '2026-01-27 09:00:00'),
(5, 2, 4, 'completed', '2026-01-26 15:00:00', 'Need help preparing for an English interview.', 1.00, 1, '2026-01-24 11:00:00');

-- 4. BƠM DỮ LIỆU BẢNG REVIEWS
INSERT INTO reviews (booking_id, reviewer_id, reviewed_user_id, rating, comment, created_at) VALUES
(2, 3, 2, 5, 'Mai was super patient and helpful! Really improved my confidence in speaking English. Highly recommend!', '2026-01-29 18:00:00'),
(3, 4, 2, 5, 'Very friendly and encouraging. Great conversation practice!', '2026-01-26 17:00:00');