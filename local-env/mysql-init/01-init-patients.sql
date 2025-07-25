CREATE DATABASE IF NOT EXISTS `patient-manager-db`;
USE `patient-manager-db`;

CREATE TABLE IF NOT EXISTS `PATIENT` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` VARCHAR(36) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(20),
    `address` VARCHAR(255),
    `city_of_residence` VARCHAR(100),
    `nationality` VARCHAR(100),
    `birth_date` DATE NOT NULL,
    `tax_code` VARCHAR(50) NOT NULL,
    `creation_date` DATETIME NOT NULL,
    INDEX `idx_patient_id` (`patient_id`),
    INDEX `idx_name` (`name`)
);

INSERT INTO `PATIENT` (`patient_id`, `name`, `email`, `phone_number`, `address`, `city_of_residence`, `nationality`, `birth_date`, `tax_code`, `creation_date`) VALUES
    ('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', '+1-555-123-4567', '123 Main St, New York, NY 10001', 'New York', 'USA', '1980-01-01', 'JNDOE80A01H501A', NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', '+1-555-987-6543', '456 Park Ave, Boston, MA 02108', 'Boston', 'USA', '1985-05-15', 'JNSMT85E15H501B', NOW());
