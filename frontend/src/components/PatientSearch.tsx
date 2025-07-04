import React, {useEffect, useState} from 'react';
import {Box, List, ListItemButton, ListItemText, Paper, TextField} from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {useNavigate} from 'react-router-dom';
import {Patient} from '../types/patient';

const SEARCH_TIMEOUT = 400;

export const PatientSearch: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        const timeoutId = setTimeout(searchPatients, SEARCH_TIMEOUT);
        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    return (
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
            <Box sx={{width: '100%', maxWidth: 600, mx: 'auto', mt: 2}}>
                <TextField
                    fullWidth
                    label="Search Patients"
                    variant="outlined"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    sx={{mb: 2}}
                />
                {showResults && patients.length > 0 && (
                    <Paper elevation={2}>
                        <List>
                            {patients.map((patient) => (
                                <ListItemButton
                                    key={patient.id}
                                    onClick={() => navigate(`/patient/${(patient.id)}`)}
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
