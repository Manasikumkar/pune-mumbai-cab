-- ============================================
-- Pune Mumbai Cab - MySQL Schema
-- ============================================
-- Run this manually or let Hibernate auto-generate via ddl-auto=update
-- Execute: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS pune_mumbai_cab
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pune_mumbai_cab;

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image_url VARCHAR(500),
    seating_capacity INT NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6),
    updated_at DATETIME(6),
    INDEX idx_vehicles_status (status),
    INDEX idx_vehicles_slug (slug)
) ENGINE=InnoDB;

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance_km DOUBLE,
    travel_time VARCHAR(100),
    one_way_price DOUBLE NOT NULL,
    round_trip_price DOUBLE NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6),
    updated_at DATETIME(6),
    INDEX idx_routes_status (status),
    INDEX idx_routes_slug (slug)
) ENGINE=InnoDB;

-- Enquiries table (booking leads)
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    pickup_location VARCHAR(500) NOT NULL,
    drop_location VARCHAR(500) NOT NULL,
    travel_date DATE,
    travel_time VARCHAR(50),
    trip_type VARCHAR(20) NOT NULL,
    vehicle_id BIGINT,
    passengers INT,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at DATETIME(6),
    INDEX idx_enquiries_status (status),
    CONSTRAINT fk_enquiries_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_slug VARCHAR(255),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    INDEX idx_faqs_route_slug (route_slug)
) ENGINE=InnoDB;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
    created_at DATETIME(6)
) ENGINE=InnoDB;
