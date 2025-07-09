import React, {ChangeEvent, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {OperationType} from '../../types/operation';

export interface CreateOperationFormData {
    type: OperationType;
    description: string;
    executor: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onOperationCreated: (operation: any) => void;
}

export const CreateOperationDialog: React.FC<Props> = ({
    open,
    onClose,
    patientId,
    onOperationCreated
}) => {
    const [formData, setFormData] = useState<CreateOperationFormData>({
        type: '' as OperationType,
        description: '',
        executor: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/operation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientId,
                    ...formData
                }),
            });

            if (response.ok) {
                const newOperation = await response.json();
                onOperationCreated(newOperation);
                onClose();
                setFormData({type: '' as OperationType, description: '', executor: ''});
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to create operation');
            }
        } catch (err) {
            setError('An error occurred while creating the operation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({type: '' as OperationType, description: '', executor: ''});
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Create New Operation
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <FormControl fullWidth required>
                            <InputLabel id="type-label">Operation Type</InputLabel>
                            <Select
                                labelId="type-label"
                                name="type"
                                value={formData.type}
                                label="Operation Type"
                                onChange={handleSelectChange}
                            >
                                {Object.values(OperationType).map(type => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            required
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleTextChange}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Executor"
                            name="executor"
                            value={formData.executor}
                            onChange={handleTextChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        Create Operation
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
