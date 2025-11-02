import React, {ChangeEvent, useEffect, useState} from 'react';
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
    toothDetails: ToothDetailForm[];
}

interface Props {
    patientId: string;
    onOperationCreated: (operation: Operation) => void;
    onCancel: () => void;
}

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
        toothDetails: []
    };
    const [formData, setFormData] = useState<OperationForm>(EMPTY_OPERATION_FORM);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [operationTypes, setOperationTypes] = useState<OperationType[]>([]);
    const [toothSelectionKey, setToothSelectionKey] = useState(0);
    const estimatedCost = operationTypes.find(ot => ot.type === formData.type)?.estimatedBaseCost.amount || 0;

    useEffect(() => {
        fetchOperationTypes();
    }, []);

    useEffect(() => {
        if (formData.type && estimatedCost > 0) {
            setToothSelectionKey(prev => prev + 1);

            const updatedToothDetails = formData.toothDetails.map(detail => ({
                ...detail,
                amount: estimatedCost.toString()
            }));

            setFormData(prev => ({
                ...prev,
                toothDetails: updatedToothDetails
            }));
        }
    }, [formData.type]);

    const fetchOperationTypes = async () => {
        try {
            const response = await RestClient.get<{types: OperationType[]}>('/api/operation-type');
            setOperationTypes(response.types);
        } catch (err) {
            console.error('Failed to fetch operation types:', err);
            setError('Failed to load operation types. Please try again.');
        }
    };

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

    const handleToothSelectionChange = (details: ToothDetailForm[]) => {
        setFormData(prev => ({
            ...prev,
            toothDetails: details
        }));
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


                    <Divider sx={{ my: 1 }} />

                    <ToothSelectionForm
                        key={toothSelectionKey}
                        onSelectionChange={handleToothSelectionChange}
                        estimatedCost={estimatedCost}
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

