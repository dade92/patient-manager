import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Card, CardContent, Typography} from '@mui/material';
import {CreatePatientForm} from '../components/forms/CreatePatientForm';
import {Patient} from "../types/patient";

export const NewPatient: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        New Patient
                    </Typography>
                    <CreatePatientForm
                        onPatientCreated={(patient: Patient) => {
                            navigate(`/patient/${patient.id}`);
                        }}
                        onCancel={() => {
                            navigate(-1);
                        }}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};
