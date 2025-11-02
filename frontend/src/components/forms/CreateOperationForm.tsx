import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    DialogActions,
    DialogContent,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import {Operation} from '../../types/operation';
import {OperationType} from '../../types/OperationType';
import {RestClient} from '../../utils/restClient';
import {ToothDetailForm, ToothSelectionForm} from './ToothSelectionForm';
import {adaptOperationPayload} from "../../utils/CreateOperationPayloadAdapter";


export interface OperationForm {
    type: string;
    patientId: string;
    description: string;
    executor: string;
    estimatedCost: string;
    toothDetails: ToothDetailForm[];
}

interface Props {
    patientId: string;
    onOperationCreated: (operation: Operation) => void;
    onCancel: () => void;
}

const ESTIMATED_COST_FIELD_NAME = "estimatedCost";

export const CreateOperationForm: React.FC<Props> = ({
    patientId,
    onOperationCreated,
    onCancel
}) => {
    const EMPTY_OPERATION_FORM: OperationForm = {
        type: '',
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
    const [operationTypes, setOperationTypes] = useState<OperationType[]>([]);
    const [loadingOperationTypes, setLoadingOperationTypes] = useState(true);

    useEffect(() => {
        const fetchOperationTypes = async () => {
            try {
                setLoadingOperationTypes(true);
                const response = await RestClient.get<{types: OperationType[]}>('/api/operation-type');
                setOperationTypes(response.types);
            } catch (err) {
                console.error('Failed to fetch operation types:', err);
                setError('Failed to load operation types. Please try again.');
            } finally {
                setLoadingOperationTypes(false);
            }
        };

        fetchOperationTypes();
    }, []);

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
        } catch (err: any) {
            setError('An error occurred while creating the operation');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                            disabled={loadingOperationTypes}
                        >
                            {operationTypes.map(operationType => (
                                <MenuItem key={operationType.type} value={operationType.type}>
                                    {operationType.type}
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
                        estimatedCost={formData.type ? operationTypes.find(ot => ot.type === formData.type)?.estimatedBaseCost.amount : undefined}
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
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </DialogActions>
        </form>
    );
};

