import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, Button, CircularProgress} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {CreateOperationDialog} from '../components/dialogs/CreateOperationDialog';
import {ConfirmationDialog} from '../components/dialogs/ConfirmationDialog';
import {PatientOperations} from '../components/lists/PatientOperations';
import {PatientInvoices} from '../components/lists/PatientInvoices';
import {PatientDetailCard} from '../components/cards/PatientDetailCard';
import {useCache} from '../context/CacheContext';
import {BackButton} from '../components/atoms/BackButton';
import {Operation} from "../types/operation";
import {usePatient} from '../hooks/usePatient';
import {useDeletePatient} from '../hooks/useDeletePatient';

export const PatientDetail: React.FC = () => {
    const {patientId} = useParams();
    const navigate = useNavigate();
    const [isCreateOperationOpen, setIsCreateOperationOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const {patient, loading, error} = usePatient(patientId!);

    const {
        setCachedOperationsForPatient,
        getCachedOperationsForPatient
    } = useCache();

    const {deletePatient, isDeleting, error: deleteError} = useDeletePatient({
        onSuccess: () => {
            navigate('/');
            setShowDeleteConfirmation(false);
        }
    });

    if (loading) {
        return (
            <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
                <BackButton sx={{mb: 2}}/>
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <BackButton/>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setShowDeleteConfirmation(true);
                        }}
                        sx={{
                            minWidth: 48,
                            minHeight: 48,
                            padding: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <DeleteIcon/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        onClick={() => {
                            setIsCreateOperationOpen(true);
                        }}
                    >
                        New Operation
                    </Button>
                </Box>
            </Box>

            {error ? (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            ) : patient ? (
                <>
                    {deleteError && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {deleteError}
                        </Alert>
                    )}

                    <PatientDetailCard patient={patient}/>

                    <PatientOperations
                        patientId={patientId!}
                        refreshTrigger={refreshKey}
                    />

                    <Box sx={{mt: 3}}>
                        <PatientInvoices
                            patientId={patientId!}
                            refreshTrigger={refreshKey}
                        />
                    </Box>

                    <CreateOperationDialog
                        open={isCreateOperationOpen}
                        onClose={() => setIsCreateOperationOpen(false)}
                        patientId={patient.id}
                        onOperationCreated={(newOperation: Operation) => {
                            const cachedOperations = getCachedOperationsForPatient(patientId!) || [];
                            setCachedOperationsForPatient(patientId!, [newOperation, ...cachedOperations]);
                            setRefreshKey(prev => prev + 1);
                        }}
                    />

                    <ConfirmationDialog
                        open={showDeleteConfirmation}
                        onClose={() => {
                            setShowDeleteConfirmation(false);
                        }}
                        onConfirm={() => {
                            deletePatient(patient!.id);
                        }}
                        title="Delete Patient Permanently"
                        message={`Are you sure you want to permanently delete patient "${patient.name}" along with all their operations and invoices? This action cannot be undone.`}
                        isLoading={isDeleting}
                    />
                </>
            ) : null}
        </Box>
    );
};
