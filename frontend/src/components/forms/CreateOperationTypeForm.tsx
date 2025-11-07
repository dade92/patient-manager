import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
    InputAdornment
} from '@mui/material';
import { useCreateOperationType } from '../../hooks/useCreateOperationType';

export interface CreateOperationTypeFormData {
    type: string;
    description: string;
    amount: string;
    currency: string;
}

interface Props {
    onOperationTypeCreated: () => void;
    onCancel: () => void;
}

const EMPTY_FORM = {
    type: '',
    description: '',
    amount: '',
    currency: 'EUR'
};

export const CreateOperationTypeForm: React.FC<Props> = ({
    onOperationTypeCreated,
    onCancel
}) => {
    const [formData, setFormData] = useState<CreateOperationTypeFormData>(EMPTY_FORM);

    const { createOperationType, isSubmitting, error } = useCreateOperationType({
        onSuccess: onOperationTypeCreated,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await createOperationType(formData);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Create New Operation Type
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                Create a new operation type that can be used when creating patient operations.
                This will define the base cost for operations of this type.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    required
                    fullWidth
                    label="Operation Type Name"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    helperText="Use uppercase letters and underscores (will be converted automatically)"
                    sx={{ mb: 3 }}
                />

                <TextField
                    required
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Describe this type of operation..."
                    sx={{ mb: 3 }}
                />

                <TextField
                    required
                    fullWidth
                    label="Cost per Tooth"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    placeholder="0.00"
                    helperText="Base cost for this operation on a single tooth"
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    disabled
                    helperText="Currently only EUR is supported"
                    sx={{ mb: 4 }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Operation Type'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};
