import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, CircularProgress, Snackbar} from '@mui/material';
import {Operation} from '../types/operation';
import {useCache} from '../context/CacheContext';
import {AddNoteDialog} from '../components/dialogs/AddNoteDialog';
import {CreateInvoiceDialog} from '../components/dialogs/CreateInvoiceDialog';
import {OperationDetailCard} from '../components/cards/OperationDetailCard';
import {BackButton} from '../components/atoms/BackButton';
import {useOperation} from '../hooks/useOperation';
import {useFileUpload} from '../hooks/useFileUpload';

export const OperationDetail: React.FC = () => {
    const navigate = useNavigate();
    const {operationId} = useParams();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { addCachedInvoiceForPatient } = useCache();

    const { operation, loading, error, updateOperation } = useOperation(operationId!);
    const { uploadFile } = useFileUpload({
        onSuccess: (updatedOperation) => {
            updateOperation(updatedOperation);
        },
        onError: () => {}
    });

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
                    onAddAsset={async (file: File) => {
                        await uploadFile(operationId!, file);
                    }}
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
                    updateOperation(updatedOperation);
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
