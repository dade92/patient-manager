import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Invoice } from '../../types/invoice';

interface Props {
    open: boolean;
    onClose: () => void;
    operationId: string;
    patientId: string;
    onInvoiceCreated: (invoice: Invoice) => void;
}

export const CreateInvoiceDialog: React.FC<Props> = ({
    open,
    onClose,
    operationId,
    patientId,
    onInvoiceCreated
}) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                        currency: 'EUR'
                    }
                })
            });

            if (response.ok) {
                const createdInvoice = await response.json();
                onInvoiceCreated(createdInvoice);
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
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Create Invoice
                <IconButton onClick={handleClose} disabled={loading}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Amount (EUR)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                        disabled={loading}
                        placeholder="0.00"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
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
