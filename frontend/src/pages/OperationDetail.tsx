import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, CircularProgress, Snackbar} from '@mui/material';
import {Operation} from '../types/operation';
import {useCache} from '../context/CacheContext';
import {AddNoteDialog} from '../components/dialogs/AddNoteDialog';
import {CreateInvoiceDialog} from '../components/dialogs/CreateInvoiceDialog';
import {OperationDetailCard} from '../components/cards/OperationDetailCard';
import {BackButton} from '../components/atoms/BackButton';
import { RestClient } from '../utils/restClient';

export const OperationDetail: React.FC = () => {
    const {operationId} = useParams();
    const navigate = useNavigate();
    const [operation, setOperation] = useState<Operation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const {
        getCachedOperation,
        setCachedOperation,
        getCachedOperationsForPatient,
        setCachedOperationsForPatient,
        addCachedInvoiceForPatient
    } = useCache();

    const fetchOperation = async () => {
        const cachedOperation = getCachedOperation(operationId!);
        if (cachedOperation) {
            setOperation(cachedOperation);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await RestClient.get<Operation>(`/api/operation/${operationId}`);
            setOperation(data);
            setCachedOperation(operationId!, data);
        } catch (error: any) {
            if (error && error.status === 404) {
                setError(`Operation with ID ${operationId} was not found`);
                setOperation(null);
            } else {
                setError('An error occurred while fetching the operation data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!operationId || !operation) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`/api/operation/${operationId}/assets`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const updatedOperation = await response.json();
                setOperation(updatedOperation);
                setCachedOperation(operationId, updatedOperation);
                updateOperationInPatientCache(updatedOperation);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload file');
            }
        } catch (error) {
            throw error;
        }
    };

    const updateOperationInPatientCache = (updatedOperation: Operation) => {
        const patientId = operation!.patientId;
        const cachedOperations = getCachedOperationsForPatient(patientId);

        if (cachedOperations && cachedOperations.length > 0) {
            const updatedOperations = cachedOperations.map(op =>
                op.id === updatedOperation.id ? updatedOperation : op
            );
            setCachedOperationsForPatient(patientId, updatedOperations);
        }
    };

    useEffect(() => {
        fetchOperation();
    }, [operationId, getCachedOperation, setCachedOperation]);

    if (loading) {
        return (
            <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
                <BackButton onClick={() => navigate(-1)} sx={{mb: 2}}/>
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <BackButton onClick={() => navigate(-1)} sx={{mb: 2}}/>

            {error ? (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            ) : operation ? (
                <OperationDetailCard
                    operation={operation}
                    onAddAsset={handleFileUpload}
                    onAddNote={() => setDialogOpen(true)}
                    onCreateInvoice={() => setInvoiceDialogOpen(true)}
                    onPatientIdClick={(patientId: string) => navigate(`/patient/${patientId}`)}
                />
            ) : null}

            <AddNoteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                operationId={operationId!}
                onNoteAdded={(updatedOperation: Operation) => {
                    if (!operationId) return;
                    setOperation(updatedOperation);
                    setCachedOperation(operationId, updatedOperation);
                    updateOperationInPatientCache(updatedOperation);
                }}
            />

            <CreateInvoiceDialog
                open={invoiceDialogOpen}
                onClose={() => setInvoiceDialogOpen(false)}
                operationId={operationId || ''}
                patientId={operation?.patientId || ''}
                onInvoiceCreated={(createdInvoice) => {
                    setShowSuccessMessage(true);

                    if (operation?.patientId) {
                        addCachedInvoiceForPatient(operation.patientId, createdInvoice);
                    }
                }}
                estimatedCost={operation!.estimatedCost}
            />

            <Snackbar
                open={showSuccessMessage}
                autoHideDuration={4000}
                onClose={() => setShowSuccessMessage(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setShowSuccessMessage(false)}
                    severity="success"
                    sx={{width: '100%'}}
                >
                    Invoice created successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};
