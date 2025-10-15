INSERT INTO `PATIENT` (patient_id, name, email, phone_number, address, city_of_residence, nationality, birth_date, tax_code, creation_date) VALUES
('PAT-001', 'John Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Springfield', 'Italian', DATE '1990-01-01', 'TAXCODE123', CURRENT_TIMESTAMP()),
('PAT-002', 'Jane Roe', 'jane.roe@example.com', NULL, NULL, 'Metropolis', 'French', DATE '1985-05-20', 'TAX987', CURRENT_TIMESTAMP());
