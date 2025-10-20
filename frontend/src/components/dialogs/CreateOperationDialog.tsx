import React, {ChangeEvent, useState, useCallback} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Operation, OperationType, PatientOperationInfo} from '../../types/operation';
import {RestClient} from '../../utils/restClient';
import { Money } from '../../types/Money';
import { ToothSelectionForm } from '../forms/ToothSelectionForm';

interface Props {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onOperationCreated: (operation: Operation) => void;
}

interface ToothDetail {
    toothNumber: number | null;
    amount: string;
}

export const CreateOperationDialog: React.FC<Props> = ({
    open,
    onClose,
    patientId,
    onOperationCreated
}) => {
    const [formData, setFormData] = useState({
        type: '' as OperationType,
        patientId: patientId,
        description: '',
        executor: '',
        estimatedCost: ''
    });
    const [toothDetails, setToothDetails] = useState<ToothDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoUpdateCost, setAutoUpdateCost] = useState(true);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        // If manually editing the estimated cost, disable auto-updates
        if (name === 'estimatedCost') {
            setAutoUpdateCost(false);
        }

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

    const handleToothSelectionChange = (details: ToothDetail[]) => {
        setToothDetails(details);
    };

    // Update estimated cost when tooth amounts change
    const handleTotalAmountChange = useCallback((totalAmount: number) => {
        if (autoUpdateCost) {
            setFormData(prev => ({
                ...prev,
                estimatedCost: totalAmount > 0 ? totalAmount.toFixed(2) : ''
            }));
        }
    }, [autoUpdateCost]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Convert tooth details to the format expected by the API
            const formattedToothDetails = toothDetails
                .filter(detail => detail.toothNumber !== null && detail.amount.trim() !== '')
                .map(detail => ({
                    toothNumber: detail.toothNumber,
                    amount: parseFloat(detail.amount) || 0
                }));

            const operationPayload = {
                ...formData,
                estimatedCost: {
                    amount: parseFloat(formData.estimatedCost) || 0,
                    currency: 'EUR'
                } as Money,
                patientOperationInfo: {
                    details: formattedToothDetails
                }
            };

            const newOperation = await RestClient.post<Operation>(
                '/api/operation',
                operationPayload
            );
            onOperationCreated(newOperation);
            onClose();
            setFormData({type: '' as OperationType, patientId: patientId, description: '', executor: '', estimatedCost: ''});
            setToothDetails([]);
            setAutoUpdateCost(true);
        } catch (err: any) {
            setError('An error occurred while creating the operation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({type: '' as OperationType, patientId: patientId, description: '', executor: '', estimatedCost: ''});
        setToothDetails([]);
        setError(null);
        setAutoUpdateCost(true);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Create New Operation
                <IconButton onClick={handleClose}>
                    <CloseIcon/>
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

                        <TextField
                            required
                            fullWidth
                            label="Estimated Cost"
                            name="estimatedCost"
                            type="number"
                            inputProps={{ step: '0.01', min: '0' }}
                            value={formData.estimatedCost}
                            onChange={handleTextChange}
                            helperText={autoUpdateCost ? "Auto-updating based on tooth amounts" : "Manually set (auto-update disabled)"}
                        />

                        <Divider sx={{ my: 1 }} />

                        <ToothSelectionForm
                            onSelectionChange={handleToothSelectionChange}
                            onTotalAmountChange={handleTotalAmountChange}
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
