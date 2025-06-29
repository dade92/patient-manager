CREATE TABLE IF NOT EXISTS OPERATION (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operation_id VARCHAR(36) NOT NULL UNIQUE,
    patient_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
