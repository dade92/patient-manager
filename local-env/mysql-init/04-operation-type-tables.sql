CREATE TABLE IF NOT EXISTS OPERATION_TYPE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operation_type VARCHAR(50) NOT NULL UNIQUE,
    estimated_base_cost DECIMAL(10, 2) NOT NULL,
    estimated_base_cost_currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    description VARCHAR(512) NOT NULL,
    INDEX idx_operation_type (operation_type)
);

INSERT IGNORE INTO OPERATION_TYPE (operation_type, estimated_base_cost, estimated_base_cost_currency, description)
VALUES
    ('CONSULTATION', 100.00, 'EUR', 'Standard consultation with doctor'),
    ('SURGERY', 1500.00, 'EUR', 'Complex surgical procedure'),
    ('DIAGNOSTIC', 250.00, 'EUR', 'Diagnostic examination and tests'),
    ('TREATMENT', 300.00, 'EUR', 'Medical treatment session'),
    ('FOLLOW_UP', 75.00, 'EUR', 'Follow-up appointment'),
    ('EMERGENCY', 500.00, 'EUR', 'Emergency medical intervention'),
    ('PREVENTIVE', 150.00, 'EUR', 'Preventive care and checkup');
