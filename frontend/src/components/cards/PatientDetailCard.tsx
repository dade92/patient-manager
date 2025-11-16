import React from 'react';
import {Box, Card, CardContent, Grid, Typography} from '@mui/material';
import {Patient} from '../../types/patient';
import {formatDate} from '../../utils/dateUtils';
import {ExpandableChip} from '../atoms/ExpandableChip';

interface Props {
    patient: Patient;
}

export const PatientDetailCard: React.FC<Props> = ({patient}) => (
    <Card sx={{mb: 4}} data-testid="patient-detail-card">
        <CardContent>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2
            }}>
                <Typography variant="h5" gutterBottom data-testid="patient-name">
                    {patient.name}
                </Typography>
                <ExpandableChip
                    label={`Patient ID: ${patient.id}`}
                    color="primary"
                    title={`Patient ID: ${patient.id}`}
                    data-testid="patient-id-chip"
                />
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} data-testid="patient-email">
                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    <Typography variant="body1" gutterBottom>{patient.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} data-testid="patient-tax-code">
                    <Typography variant="subtitle2" color="textSecondary">Tax Code</Typography>
                    <Typography variant="body1" gutterBottom>{patient.taxCode}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} data-testid="patient-phone">
                    <Typography variant="subtitle2" color="textSecondary">Phone Number</Typography>
                    <Typography variant="body1" gutterBottom>{patient.phoneNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} data-testid="patient-address">
                    <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                    <Typography variant="body1" gutterBottom>{patient.address}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} data-testid="patient-city">
                    <Typography variant="subtitle2" color="textSecondary">City of Residence</Typography>
                    <Typography variant="body1" gutterBottom>{patient.cityOfResidence}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} data-testid="patient-nationality">
                    <Typography variant="subtitle2" color="textSecondary">Nationality</Typography>
                    <Typography variant="body1" gutterBottom>{patient.nationality}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} data-testid="patient-birth-date">
                    <Typography variant="subtitle2" color="textSecondary">Birth Date</Typography>
                    <Typography variant="body1" gutterBottom>{formatDate(patient.birthDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} data-testid="patient-medical-history">
                    <Typography variant="subtitle2" color="textSecondary">Medical History</Typography>
                    <Typography variant="body1" gutterBottom>{patient.medicalHistory}</Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);
