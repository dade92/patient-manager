-- Drop operation-related tables first to avoid FK issues if present
DROP TABLE IF EXISTS `OPERATION_NOTE`;
DROP TABLE IF EXISTS `OPERATION_ASSET`;
DROP TABLE IF EXISTS `OPERATION`;

-- Existing patient table
DROP TABLE IF EXISTS `PATIENT`;

CREATE TABLE `PATIENT` (
    `patient_id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(50),
    `address` VARCHAR(255),
    `city_of_residence` VARCHAR(255),
    `nationality` VARCHAR(100),
    `birth_date` DATE NOT NULL,
    `tax_code` VARCHAR(100) NOT NULL,
    `creation_date` TIMESTAMP NOT NULL,
    `medical_history` TEXT
);

-- Operation main table
CREATE TABLE `OPERATION` (
    `operation_id` VARCHAR(255) PRIMARY KEY,
    `patient_id` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `description` VARCHAR(1024) NOT NULL,
    `executor` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `estimated_cost` DECIMAL(19,2) NOT NULL,
    `info` TEXT
);

-- Operation assets table
CREATE TABLE `OPERATION_ASSET` (
    `operation_id` VARCHAR(255) NOT NULL,
    `asset_name` VARCHAR(512) NOT NULL
);

-- Operation notes table
CREATE TABLE `OPERATION_NOTE` (
    `operation_id` VARCHAR(255) NOT NULL,
    `content` VARCHAR(2048) NOT NULL,
    `created_at` TIMESTAMP NOT NULL
);

-- Invoice table
DROP TABLE IF EXISTS `INVOICE`;
CREATE TABLE `INVOICE` (
    `invoice_id` VARCHAR(255) PRIMARY KEY,
    `operation_id` VARCHAR(255) NOT NULL,
    `patient_id` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(19,2) NOT NULL,
    `currency` VARCHAR(10) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
