-- Create Invoice table
CREATE TABLE IF NOT EXISTS INVOICE (
    invoice_id VARCHAR(50) PRIMARY KEY,
    operation_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (operation_id) REFERENCES OPERATION(operation_id)
);

-- Create index for faster operation lookups
CREATE INDEX IF NOT EXISTS idx_invoice_operation ON INVOICE(operation_id);
