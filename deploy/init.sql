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
    `medical_history` TEXT,
    INDEX `idx_patient_id` (`patient_id`),
    INDEX `idx_name` (`name`)
    );

CREATE TABLE IF NOT EXISTS OPERATION (
                                         id INT AUTO_INCREMENT PRIMARY KEY,
                                         operation_id VARCHAR(36) NOT NULL UNIQUE,
    patient_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    executor VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estimated_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    info TEXT,
    INDEX idx_patient_id (patient_id),
    INDEX idx_operation_id (operation_id)
    );

CREATE TABLE IF NOT EXISTS OPERATION_ASSET (
                                               id INT AUTO_INCREMENT PRIMARY KEY,
                                               operation_id VARCHAR(36) NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    INDEX idx_operation_id (operation_id),
    FOREIGN KEY (operation_id) REFERENCES OPERATION(operation_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS OPERATION_NOTE (
                                              id INT AUTO_INCREMENT PRIMARY KEY,
                                              operation_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_operation_id (operation_id),
    FOREIGN KEY (operation_id) REFERENCES OPERATION(operation_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS OPERATION_TYPE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operation_type VARCHAR(50) NOT NULL UNIQUE,
    estimated_base_cost DECIMAL(10, 2) NOT NULL,
    estimated_base_cost_currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    description VARCHAR(512) NOT NULL,
    INDEX idx_operation_type (operation_type)
);

CREATE TABLE IF NOT EXISTS INVOICE (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       invoice_id VARCHAR(50) NOT NULL UNIQUE,
    operation_id VARCHAR(50) NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (operation_id) REFERENCES OPERATION(operation_id),
    FOREIGN KEY (patient_id) REFERENCES PATIENT(patient_id),
    INDEX idx_invoice_operation (operation_id),
    INDEX idx_invoice_patient (patient_id)
    );
