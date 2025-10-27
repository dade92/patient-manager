import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Card, CardContent, Typography} from '@mui/material';
import {CreatePatientForm} from '../components/forms/CreatePatientForm';

export const NewPatient: React.FC = () => {
    const navigate = useNavigate();

    const handlePatientCreated = (patient: any) => {
        navigate(`/patient/${patient.id}`);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        New Patient
                    </Typography>
                    <CreatePatientForm
                        onPatientCreated={handlePatientCreated}
                        onCancel={handleCancel}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};
