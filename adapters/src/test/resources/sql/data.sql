INSERT INTO `PATIENT` (patient_id, name, email, phone_number, address, city_of_residence, nationality, birth_date, tax_code, creation_date, medical_history) VALUES
('PAT-001', 'John Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Springfield', 'Italian', DATE '1990-01-01', 'TAXCODE123', CURRENT_TIMESTAMP(), 'medical history'),
('PAT-002', 'Jane Roe', 'jane.roe@example.com', NULL, NULL, 'Metropolis', 'French', DATE '1985-05-20', 'TAX987', CURRENT_TIMESTAMP(), 'medical history');

-- Seed one operation for PAT-001 with one asset and one note
INSERT INTO `OPERATION` (operation_id, patient_id, type, description, executor, created_at, updated_at, estimated_cost, info) VALUES
('OP-001', 'PAT-001', 'SURGERY', 'Appendectomy', 'Dr. Who', TIMESTAMP '2025-01-01 10:00:00', TIMESTAMP '2025-01-01 10:00:00', 2500.00, '{"details": [{"toothNumber": 2, "estimatedCost": {"amount": 150.50, "currency": "EUR"}, "toothType": "PERMANENT"}]}');

INSERT INTO `OPERATION_ASSET` (operation_id, asset_name) VALUES
('OP-001', 'scan1.png');

INSERT INTO `OPERATION_NOTE` (operation_id, content, created_at) VALUES
('OP-001', 'Initial assessment complete', TIMESTAMP '2025-01-01 11:00:00');

-- Seed invoices for OP-001 / PAT-001
INSERT INTO `INVOICE` (invoice_id, operation_id, patient_id, amount, currency, status, created_at, updated_at) VALUES
('INV-001', 'OP-001', 'PAT-001', 100.00, 'EUR', 'PENDING', TIMESTAMP '2025-01-01 12:00:00', TIMESTAMP '2025-01-01 12:00:00'),
('INV-002', 'OP-001', 'PAT-001', 150.50, 'EUR', 'PAID',    TIMESTAMP '2025-01-02 09:00:00', TIMESTAMP '2025-01-02 09:00:00');
