import React, {ChangeEvent, useCallback, useState} from 'react';
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
import {Money} from '../../types/Money';
import {ToothDetail, ToothSelectionForm} from '../forms/ToothSelectionForm';

interface Props {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onOperationCreated: (operation: Operation) => void;
}

const ESTIMATED_COST_FIELD_NAME = "estimatedCost";
const toMoney = (amount: string): Money => ({
    amount: parseFloat(amount),
    currency: 'EUR'
})

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

    const handleToothSelectionChange = (details: ToothDetail[]) => {
        setToothDetails(details);
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
            const formattedToothDetails = toothDetails
                .filter(detail => detail.toothNumber !== null && detail.amount.trim() !== '')
                .map(detail => ({
                    toothNumber: detail.toothNumber,
                    estimatedCost: toMoney(detail.amount)
                }));

            const operationPayload = {
                ...formData,
                estimatedCost: toMoney(formData.estimatedCost),
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
                            name={ESTIMATED_COST_FIELD_NAME}
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
