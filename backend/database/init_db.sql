-- Tạo database
CREATE DATABASE IF NOT EXISTS uniswap_db;
USE uniswap_db;

-- 1. Bảng Users (Trọng tâm hiện tại)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CLIENT') DEFAULT 'CLIENT',
    time_balance_available DECIMAL(10,2) DEFAULT 0.00,
    time_balance_escrow DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Skills (Danh mục kỹ năng)
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    provider_id INT,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Bảng Service Offers (Các dịch vụ được đăng lên)
CREATE TABLE IF NOT EXISTS service_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    skill_id INT,
    cost_per_hour DECIMAL(10,2) DEFAULT 1.00,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 4. Bảng Bookings (Giao dịch Ký quỹ - Escrow)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT,
    seller_id INT,
    offer_id INT,
    status ENUM('PENDING', 'ACCEPTED', 'IN_ESCROW', 'COMPLETED', 'CANCELLED', 'DISPUTED') DEFAULT 'PENDING',
    cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (offer_id) REFERENCES service_offers(id)
);

-- 5. Bảng Transaction History (Lịch sử dòng tiền)
CREATE TABLE IF NOT EXISTS transaction_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('EARNED', 'SPENT', 'ESCROW_HOLD', 'ESCROW_RELEASE', 'ESCROW_REFUND') NOT NULL,
    booking_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);