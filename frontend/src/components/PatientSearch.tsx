import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types/patient';

export const PatientSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.length < 2) {
        setPatients([]);
        return;
      }

      try {
        const response = await fetch(`/api/patient/search?name=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setPatients(data.patients);
      } catch (error) {
        console.error('Error searching patients:', error);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePatientClick = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 2 }}>
      <TextField
        fullWidth
        label="Search Patients"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      {patients.length > 0 && (
        <Paper elevation={2}>
          <List>
            {patients.map((patient) => (
              <ListItem
                key={patient.id}
                button
                onClick={() => handlePatientClick(patient.id)}
              >
                <ListItemText
                  primary={patient.name}
                  secondary={`${patient.cityOfResidence} • ${patient.email}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
