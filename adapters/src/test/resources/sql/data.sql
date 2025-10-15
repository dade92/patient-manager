INSERT INTO `PATIENT` (patient_id, name, email, phone_number, address, city_of_residence, nationality, birth_date, tax_code, creation_date) VALUES
('PAT-001', 'John Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Springfield', 'Italian', DATE '1990-01-01', 'TAXCODE123', CURRENT_TIMESTAMP()),
('PAT-002', 'Jane Roe', 'jane.roe@example.com', NULL, NULL, 'Metropolis', 'French', DATE '1985-05-20', 'TAX987', CURRENT_TIMESTAMP());

-- Seed one operation for PAT-001 with one asset and one note
INSERT INTO `OPERATION` (operation_id, patient_id, type, description, executor, created_at, updated_at, estimated_cost) VALUES
('OP-001', 'PAT-001', 'SURGERY', 'Appendectomy', 'Dr. Who', TIMESTAMP '2025-01-01 10:00:00', TIMESTAMP '2025-01-01 10:00:00', 2500.00);

INSERT INTO `OPERATION_ASSET` (operation_id, asset_name) VALUES
('OP-001', 'scan1.png');

INSERT INTO `OPERATION_NOTE` (operation_id, content, created_at) VALUES
('OP-001', 'Initial assessment complete', TIMESTAMP '2025-01-01 11:00:00');
