import React, { useState, useEffect } from 'react';
import {TextField, List, ListItemText, Paper, Box, ListItemButton} from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types/patient';

export const PatientSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchPatients = async () => {
      if (searchInput.length < 2) {
        setPatients([]);
        return;
      }

      try {
        const response = await fetch(`/api/patient/search?name=${encodeURIComponent(searchInput)}`);
        const data = await response.json();
        setPatients(data.patients);
      } catch (error) {
        console.error('Error searching patients:', error);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handlePatientClick = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 2 }}>
        <TextField
          fullWidth
          label="Search Patients"
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={handleSearchFocus}
          sx={{ mb: 2 }}
        />
        {showResults && patients.length > 0 && (
          <Paper elevation={2}>
            <List>
              {patients.map((patient) => (
                <ListItemButton
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                >
                  <ListItemText
                    primary={patient.name}
                    secondary={`${patient.cityOfResidence} • ${patient.email}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};
