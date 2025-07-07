import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';

interface CreateInvoiceDialogProps {
    open: boolean;
    onClose: () => void;
    operationId: string;
    patientId: string;
    onInvoiceCreated: () => void;
}

export const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({
    open,
    onClose,
    operationId,
    patientId,
    onInvoiceCreated
}) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currencies = [
        { value: 'EUR', label: 'EUR' },
        { value: 'USD', label: 'USD' },
        { value: 'GBP', label: 'GBP' }
    ];

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    operationId,
                    patientId,
                    amount: {
                        amount: parseFloat(amount),
                        currency
                    }
                })
            });

            if (response.ok) {
                onInvoiceCreated();
                handleClose();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to create invoice');
            }
        } catch (error) {
            setError('An error occurred while creating the invoice');
            console.error('Error creating invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAmount('');
        setCurrency('EUR');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                        disabled={loading}
                    />

                    <TextField
                        select
                        label="Currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        fullWidth
                        disabled={loading}
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !amount}
                >
                    {loading ? <CircularProgress size={20} /> : 'Create Invoice'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
