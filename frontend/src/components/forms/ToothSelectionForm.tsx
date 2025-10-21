import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateFdiTeethNumbers } from '../../utils/teethUtils';
import TeethGrid from './TeethGrid';

export interface ToothDetail {
    toothNumber: number | null;
    amount: string;
}

interface Props {
    onSelectionChange: (details: ToothDetail[]) => void;
    onTotalAmountChange: (totalAmount: number) => void;
}

export const ToothSelectionForm: React.FC<Props> = ({
    onSelectionChange,
    onTotalAmountChange
}) => {
    const [toothDetails, setToothDetails] = useState<ToothDetail[]>([{
        toothNumber: null,
        amount: ''
    }]);

    useEffect(() => {
        const totalAmount = toothDetails.reduce((sum, detail) => {
            const amount = parseFloat(detail.amount) || 0;
            return sum + amount;
        }, 0);

        onTotalAmountChange(totalAmount);
    }, [toothDetails, onTotalAmountChange]);

    const teeth = generateFdiTeethNumbers();

    const handleToothSelection = (detailIndex: number, toothNumber: number) => {
        const updatedDetails = [...toothDetails];
        updatedDetails[detailIndex].toothNumber = toothNumber;
        setToothDetails(updatedDetails);
        onSelectionChange(updatedDetails);
    };

    const handleAmountChange = (detailIndex: number, amount: string) => {
        const updatedDetails = [...toothDetails];
        updatedDetails[detailIndex].amount = amount;
        setToothDetails(updatedDetails);
        onSelectionChange(updatedDetails);
    };

    const addToothDetail = () => {
        setToothDetails([...toothDetails, { toothNumber: null, amount: '' }]);
    };

    const removeToothDetail = (index: number) => {
        const updatedDetails = toothDetails.filter((_, i) => i !== index);
        setToothDetails(updatedDetails);
        onSelectionChange(updatedDetails);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Tooth Details
            </Typography>

            {toothDetails.map((detail, detailIndex) => (
                <Paper
                    key={detailIndex}
                    elevation={1}
                    sx={{ p: 2, mb: 2, position: 'relative' }}
                >
                    <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={() => removeToothDetail(detailIndex)}
                        disabled={toothDetails.length <= 1}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>

                    <Typography variant="subtitle2" gutterBottom>
                        Selection {detailIndex + 1}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Select tooth number:
                        </Typography>
                        <TeethGrid
                            selectedTooth={detail.toothNumber}
                            onToothSelect={(toothNumber) => handleToothSelection(detailIndex, toothNumber)}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={detail.amount}
                        onChange={(e) => handleAmountChange(detailIndex, e.target.value)}
                        inputProps={{ step: '0.01', min: '0' }}
                        sx={{ mb: 1 }}
                    />
                </Paper>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={addToothDetail}
                sx={{ mt: 1 }}
            >
                Add Another Tooth
            </Button>
        </Box>
    );
};
