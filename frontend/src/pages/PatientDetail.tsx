import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, Button, CircularProgress} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {Patient} from '../types/patient';
import {CreateOperationDialog} from '../components/dialogs/CreateOperationDialog';
import {ConfirmationDialog} from '../components/dialogs/ConfirmationDialog';
import {PatientOperations} from '../components/lists/PatientOperations';
import {PatientInvoices} from '../components/lists/PatientInvoices';
import {PatientDetailCard} from '../components/cards/PatientDetailCard';
import {useCache} from '../context/CacheContext';
import {BackButton} from '../components/atoms/BackButton';
import {Operation} from "../types/operation";
import {RestClient} from '../utils/restClient';

export const PatientDetail: React.FC = () => {
    const {patientId} = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateOperationOpen, setIsCreateOperationOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const {
        getCachedPatient,
        setCachedPatient,
        setCachedOperationsForPatient,
        getCachedOperationsForPatient
    } = useCache();

    const fetchPatient = async () => {
        const cachedPatient = getCachedPatient(patientId!);
        if (cachedPatient) {
            setPatient(cachedPatient);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await RestClient.get<Patient>(`/api/patient/${patientId}`);
            setPatient(data);
            setCachedPatient(patientId!, data);
        } catch (error: any) {
            if (error && error.status === 404) {
                setError(`Patient with ID ${patientId} was not found`);
                setPatient(null);
            } else {
                setError('An error occurred while fetching the patient data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await RestClient.post(`/api/patient/delete/${patient!.id}`, {});
            navigate('/');
        } catch (error: any) {
            setDeleteError(error.message || 'Failed to delete patient');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirmation(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
        setDeleteError(null);
    };

    useEffect(() => {
        fetchPatient();
    }, [patientId, getCachedPatient, setCachedPatient]);

    if (loading) {
        return (
            <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
                <BackButton onClick={handleBack} sx={{mb: 2}}/>
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <BackButton onClick={handleBack}/>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon/>}
                        onClick={handleDeleteClick}
                    >
                        Delete Patient
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
                        onClose={handleDeleteCancel}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Patient Permanently"
                        message={`Are you sure you want to permanently delete patient "${patient.name}" along with all their operations and invoices? This action cannot be undone.`}
                        isLoading={isDeleting}
                    />
                </>
            ) : null}
        </Box>
    );
};
