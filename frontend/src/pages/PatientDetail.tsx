import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import {Patient} from '../types/patient';
import {CreateOperationDialog} from '../components/CreateOperationDialog';

export const PatientDetail: React.FC = () => {
    const {patientId} = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateOperationOpen, setIsCreateOperationOpen] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/patient/${patientId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPatient(data);
                } else if (response.status === 404) {
                    setError(`Patient with ID ${patientId} was not found`);
                    setPatient(null);
                } else {
                    setError('An error occurred while fetching the patient data');
                }
            } catch (error) {
                setError('An error occurred while fetching the patient data');
                console.error('Error fetching patient:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [patientId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleCreateOperation = () => {
        setIsCreateOperationOpen(true);
    };

    const handleOperationCreated = () => {
        // Optionally refresh patient data or implement operations list component
    };

    if (loading) {
        return (
            <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBack}
                    sx={{mb: 2}}
                >
                    Back
                </Button>
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBack}
                >
                    Back
                </Button>
                {patient && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        onClick={handleCreateOperation}
                    >
                        New Operation
                    </Button>
                )}
            </Box>

            {error ? (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            ) : patient ? (
                <>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                {patient.name}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                                    <Typography variant="body1" gutterBottom>{patient.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                                    <Typography variant="body1" gutterBottom>{patient.phoneNumber}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                                    <Typography variant="body1" gutterBottom>{patient.address}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">City</Typography>
                                    <Typography variant="body1" gutterBottom>{patient.cityOfResidence}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Nationality</Typography>
                                    <Typography variant="body1" gutterBottom>{patient.nationality}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Birth Date</Typography>
                                    <Typography variant="body1" gutterBottom>{patient.birthDate}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <CreateOperationDialog
                        open={isCreateOperationOpen}
                        onClose={() => setIsCreateOperationOpen(false)}
                        patientId={patient.id}
                        onOperationCreated={handleOperationCreated}
                    />
                </>
            ) : null}
        </Box>
    );
};
