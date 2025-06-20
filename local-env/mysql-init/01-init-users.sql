CREATE DATABASE IF NOT EXISTS users;
USE users;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    birth_date DATE NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_name (name)
);

INSERT INTO users (user_id, name, email, phone_number, address, birth_date) VALUES
    ('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', '+1-555-123-4567', '123 Main St, New York, NY 10001', '1980-01-01'),
    ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', '+1-555-987-6543', '456 Park Ave, Boston, MA 02108', '1985-05-15');
