-- Test data for operation type repository tests
INSERT INTO OPERATION_TYPE (operation_type, estimated_base_cost, estimated_base_cost_currency, description)
VALUES
    ('CONSULTATION', 100.00, 'EUR', 'Standard consultation'),
    ('SURGERY', 1500.00, 'EUR', 'Complex surgical procedure'),
    ('DIAGNOSTIC', 250.00, 'EUR', 'Diagnostic examination'),
    ('TREATMENT', 300.00, 'EUR', 'Medical treatment');

