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
import {ToothDetailForm, ToothSelectionForm} from './ToothSelectionForm';
import {useOperationTypes} from "../../hooks/useOperationTypes";
import {useCreateOperation} from "../../hooks/useCreateOperation";

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
    const [toothSelectionKey, setToothSelectionKey] = useState(0);
    const { operationTypes, loading: loadingOperationTypes, error: operationTypesError } = useOperationTypes();
    const { createOperation, error, isSubmitting } = useCreateOperation(patientId);
    const estimatedCost = operationTypes.find(ot => ot.type === formData.type)?.estimatedBaseCost.amount || 0;

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
    }, [formData.type, estimatedCost]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newOperation = await createOperation(formData);
        if (newOperation) {
            onOperationCreated(newOperation);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
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
        <form onSubmit={handleSubmit} data-testid="create-operation-form">
            <DialogContent>
                {(error || operationTypesError) && (
                    <Alert severity="error" sx={{mb: 2}} data-testid="create-operation-error-alert">
                        {error || operationTypesError}
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
                            onChange={handleChange}
                            disabled={loadingOperationTypes}
                            data-testid="operation-type-select"
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
                        onChange={handleChange}
                        autoComplete="off"
                        data-testid="description-input"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Executor"
                        name="executor"
                        value={formData.executor}
                        onChange={handleChange}
                        autoComplete="off"
                        data-testid="executor-input"
                    />
                    <Divider sx={{ my: 1 }} />
                    <ToothSelectionForm
                        key={toothSelectionKey}
                        onSelectionChange={handleToothSelectionChange}
                        estimatedCost={estimatedCost}
                        data-testid="tooth-selection-form"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    data-testid="create-operation-button"
                >
                    Create Operation
                </Button>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    disabled={isSubmitting}
                    data-testid="cancel-button"
                >
                    Cancel
                </Button>
            </DialogActions>
        </form>
    );
};