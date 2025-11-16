import React, {useState, useEffect} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Invoice} from '../../types/invoice';
import {Money} from "../../types/Money";
import {useCreateInvoice} from "../../hooks/useCreateInvoice";

interface Props {
    open: boolean;
    onClose: () => void;
    operationId: string;
    patientId: string;
    onInvoiceCreated: (invoice: Invoice) => void;
    estimatedCost: Money;
}

export const CreateInvoiceDialog: React.FC<Props> = ({
     open,
     onClose,
     operationId,
     patientId,
     onInvoiceCreated,
     estimatedCost
 }) => {
    const [amount, setAmount] = useState('');
    const { createInvoice, error, isSubmitting } = useCreateInvoice({ patientId });

    useEffect(() => {
        setAmount(estimatedCost.amount.toString());
    }, [open, estimatedCost]);

    const handleSubmit = async () => {
        const newInvoice = await createInvoice({
            operationId,
            patientId,
            amount: {
                amount: parseFloat(amount),
                currency: 'EUR'
            }
        });

        if (newInvoice) {
            onInvoiceCreated(newInvoice);
            handleClose();
        }
    };

    const handleClose = () => {
        setAmount('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Create Invoice
                <IconButton onClick={handleClose} disabled={isSubmitting}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Amount (EUR)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        inputProps={{min: 0, step: 0.01}}
                        disabled={isSubmitting}
                        placeholder="0.00"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting || !amount}
                >
                    {isSubmitting ? <CircularProgress size={20}/> : 'Create Invoice'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
