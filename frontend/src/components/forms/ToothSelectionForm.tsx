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
import {TeethGrid} from "./TeethGrid";
import {ToothType} from "../../types/ToothDetail";

export interface ToothDetailForm {
    toothNumber: number;
    amount: string;
    toothType: string;
}

interface Props {
    onSelectionChange: (details: ToothDetailForm[]) => void;
    onTotalAmountChange: (totalAmount: number) => void;
    estimatedCost: number;
}

export const ToothSelectionForm: React.FC<Props> = ({
    onSelectionChange,
    onTotalAmountChange,
    estimatedCost
}) => {
    const [toothDetails, setToothDetails] = useState<ToothDetailForm[]>([{
        toothNumber: 0,
        amount: '',
        toothType: ''
    }]);

    useEffect(() => {
        const totalAmount = toothDetails.reduce((sum, detail) => {
            const amount = parseFloat(detail.amount) || 0;
            return sum + amount;
        }, 0);

        onTotalAmountChange(totalAmount);
    }, [toothDetails, onTotalAmountChange]);

    useEffect(() => {
        const updatedDetails = toothDetails.map(detail => ({
            ...detail,
            amount: detail.amount || estimatedCost.toString()
        }));
        setToothDetails(updatedDetails);
        onSelectionChange(updatedDetails);
    }, [estimatedCost]);

    const handleToothSelection = (detailIndex: number, toothNumber: number, toothType: ToothType) => {
        const updatedDetails = [...toothDetails];
        updatedDetails[detailIndex].toothNumber = toothNumber;
        updatedDetails[detailIndex].toothType = toothType;
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
        const newDetail: ToothDetailForm = {
            toothNumber: 0,
            amount: estimatedCost && estimatedCost > 0 ? estimatedCost.toString() : '',
            toothType: ''
        };
        setToothDetails([...toothDetails, newDetail]);
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
                            onToothSelect={(toothNumber, toothType) => handleToothSelection(detailIndex, toothNumber, toothType)}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Amount"
                        type="text"
                        value={detail.amount}
                        onChange={(e) => handleAmountChange(detailIndex, e.target.value)}
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
