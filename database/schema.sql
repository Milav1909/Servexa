-- =====================================================
-- LOCAL SERVICE PROVIDER MANAGEMENT SYSTEM
-- Database Schema (MySQL)
-- =====================================================
-- DBMS Concepts Demonstrated:
-- 1. Primary Keys (AUTO_INCREMENT)
-- 2. Foreign Keys with Referential Integrity
-- 3. 3NF Normalization
-- 4. ENUM data type for constrained values
-- 5. UNIQUE constraints
-- 6. DEFAULT values
-- 7. ON DELETE CASCADE for referential integrity
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS local_service_provider;
USE local_service_provider;

-- =====================================================
-- TABLE 1: users
-- Stores customer/user information
-- =====================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Stores bcrypt hashed password
    address VARCHAR(255),            -- Customer address
    phone VARCHAR(20),               -- Phone number
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 2: service_providers
-- Stores service provider information
-- =====================================================
CREATE TABLE service_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Stores bcrypt hashed password
    category VARCHAR(100) NOT NULL,  -- e.g., Plumbing, Electrical, Cleaning
    location VARCHAR(200) NOT NULL,
    pincode VARCHAR(10),             -- Service area pincode for location filtering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 3: services
-- Stores services offered by providers
-- Foreign Key: provider_id references service_providers(id)
-- =====================================================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 4: bookings
-- Stores booking information
-- Foreign Keys: user_id, service_id
-- ENUM used for status constraint
-- =====================================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('Pending', 'Accepted', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 5: reviews
-- Stores user reviews for service providers
-- Foreign Keys: user_id, provider_id
-- CHECK constraint for rating (1-5)
-- =====================================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
