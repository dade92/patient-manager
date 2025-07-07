-- Create Invoice table
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

-- Insert sample invoices for existing operations
INSERT INTO INVOICE (invoice_id, operation_id, patient_id, amount, currency, status, created_at, updated_at)
VALUES
    -- Invoice for initial consultation (PAID)
    ('INV-001-2025', '33333333-3333-3333-3333-333333333333', 'P-001-2025', 150.00, 'USD', 'PAID',
     '2025-06-15 10:00:00', '2025-06-16 09:15:00'),

    -- Invoice for MRI scan (PENDING)
    ('INV-002-2025', '44444444-4444-4444-4444-444444444444', 'P-001-2025', 850.00, 'USD', 'PENDING',
     '2025-06-18 15:00:00', '2025-06-18 15:00:00'),

    -- Additional invoice for consultation follow-up (PENDING)
    ('INV-003-2025', '33333333-3333-3333-3333-333333333333', 'P-001-2025', 75.00, 'EUR', 'PENDING',
     '2025-06-29 11:30:00', '2025-06-29 11:30:00'),

    -- Invoice for knee surgery (PAID)
    ('INV-004-2025', '55555555-5555-5555-5555-555555555555', 'P-002-2025', 4250.00, 'USD', 'PAID',
     '2025-06-10 17:00:00', '2025-06-12 14:20:00'),

    -- Invoice for post-surgery medication (CANCELLED)
    ('INV-005-2025', '55555555-5555-5555-5555-555555555555', 'P-002-2025', 120.00, 'USD', 'CANCELLED',
     '2025-06-10 17:30:00', '2025-06-11 09:45:00');

