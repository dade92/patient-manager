import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Operation, OperationType} from '../../types/operation';
import {RestClient} from '../../utils/restClient';
import {ToothDetailForm, ToothSelectionForm} from '../forms/ToothSelectionForm';
import {adaptOperationPayload} from "../../utils/CreateOperationPayloadAdapter";

interface Props {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onOperationCreated: (operation: Operation) => void;
}

export interface OperationForm {
    type: OperationType;
    patientId: string;
    description: string;
    executor: string;
    estimatedCost: string;
    toothDetails: ToothDetailForm[];
}

const ESTIMATED_COST_FIELD_NAME = "estimatedCost";

export const CreateOperationDialog: React.FC<Props> = ({
    open,
    onClose,
    patientId,
    onOperationCreated
}) => {
    const EMPTY_OPERATION_FORM: OperationForm = {
        type: '' as OperationType,
        patientId: patientId,
        description: '',
        executor: '',
        estimatedCost: '',
        toothDetails: []
    };
    const [formData, setFormData] = useState<OperationForm>(EMPTY_OPERATION_FORM);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoUpdateCost, setAutoUpdateCost] = useState(true);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        if (name === ESTIMATED_COST_FIELD_NAME) {
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

    const handleToothSelectionChange = (details: ToothDetailForm[]) => {
        setFormData(prev => ({
            ...prev,
            toothDetails: details
        }));
    };

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
            const newOperation = await RestClient.post<Operation>(
                '/api/operation',
                adaptOperationPayload(formData)
            );
            onOperationCreated(newOperation);
            onClose();
        } catch (err: any) {
            setError('An error occurred while creating the operation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData(EMPTY_OPERATION_FORM);
        setAutoUpdateCost(true);
        setError(null);
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
                            autoComplete="off"
                        />

                        <TextField
                            required
                            fullWidth
                            label="Executor"
                            name="executor"
                            value={formData.executor}
                            onChange={handleTextChange}
                            autoComplete="off"
                        />

                        <TextField
                            required
                            fullWidth
                            label="Estimated Cost"
                            name={ESTIMATED_COST_FIELD_NAME}
                            type="text"
                            value={formData.estimatedCost}
                            onChange={handleTextChange}
                            helperText={autoUpdateCost ? "Auto-updating based on tooth amounts" : "Manually set (auto-update disabled)"}
                            autoComplete="off"
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
