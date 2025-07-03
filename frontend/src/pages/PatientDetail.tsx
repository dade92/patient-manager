import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid, CircularProgress } from '@mui/material';
import { Patient } from '../types/patient';

export const PatientDetail: React.FC = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patient/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
        } else {
          console.error('Patient not found');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box mt={4}>
        <Typography variant="h6" align="center">Patient not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
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
    </Box>
  );
};
