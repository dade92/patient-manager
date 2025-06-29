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

INSERT INTO OPERATION (operation_id, patient_id, type, description, notes, created_at, updated_at)
VALUES
    ('33333333-3333-3333-3333-333333333333',
     '11111111-1111-1111-1111-111111111111',
     'CONSULTATION',
     'Initial consultation for chronic back pain',
     'Patient reports lower back pain persisting for 3 months',
     '2025-06-15 09:30:00',
     '2025-06-15 09:30:00'),

    ('44444444-4444-4444-4444-444444444444',
     '11111111-1111-1111-1111-111111111111',
     'DIAGNOSTIC',
     'MRI scan of lumbar spine',
     'Ordered to investigate potential disc herniation',
     '2025-06-18 14:15:00',
     '2025-06-18 14:15:00'),

    ('55555555-5555-5555-5555-555555555555',
     '22222222-2222-2222-2222-222222222222',
     'SURGERY',
     'Arthroscopic knee surgery',
     'Procedure to repair torn meniscus in right knee',
     '2025-06-10 08:00:00',
     '2025-06-10 16:30:00');

INSERT INTO OPERATION_ASSET (operation_id, asset_name)
VALUES
    ('44444444-4444-4444-4444-444444444444', 'lumbar-mri-sagittal.jpg'),
    ('44444444-4444-4444-4444-444444444444', 'lumbar-mri-axial.jpg'),
    ('55555555-5555-5555-5555-555555555555', 'pre-surgery-knee-xray.jpg'),
    ('55555555-5555-5555-5555-555555555555', 'post-surgery-knee-xray.jpg'),
    ('55555555-5555-5555-5555-555555555555', 'arthroscopic-procedure-image.jpg');

INSERT INTO OPERATION_NOTE (operation_id, content, created_at)
VALUES
    ('33333333-3333-3333-3333-333333333333',
     'Prescribed anti-inflammatory medication and recommended physical therapy',
     '2025-06-15 09:45:00'),

    ('33333333-3333-3333-3333-333333333333',
     'Patient to return in 2 weeks for follow-up',
     '2025-06-15 09:50:00'),

    ('44444444-4444-4444-4444-444444444444',
     'MRI shows mild disc bulging at L4-L5',
     '2025-06-19 10:30:00'),

    ('55555555-5555-5555-5555-555555555555',
     'Surgery completed without complications',
     '2025-06-10 16:00:00'),

    ('55555555-5555-5555-5555-555555555555',
     'Patient moved to recovery room',
     '2025-06-10 16:15:00'),

    ('55555555-5555-5555-5555-555555555555',
     'Scheduled follow-up appointment in 10 days for suture removal',
     '2025-06-10 16:25:00');
