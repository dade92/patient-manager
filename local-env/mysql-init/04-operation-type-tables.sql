CREATE TABLE IF NOT EXISTS OPERATION_TYPE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operation_type VARCHAR(50) NOT NULL UNIQUE,
    estimated_base_cost DECIMAL(10, 2) NOT NULL,
    estimated_base_cost_currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    description VARCHAR(512) NOT NULL,
    INDEX idx_operation_type (operation_type)
);

