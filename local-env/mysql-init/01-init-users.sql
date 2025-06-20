-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS users;
USE users;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    INDEX idx_user_id (user_id)
);

-- Add some sample users (optional)
INSERT INTO users (user_id, name, email, birth_date) VALUES
    ('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', '1980-01-01'),
    ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', '1985-05-15');
