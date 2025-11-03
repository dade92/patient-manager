import React, {useState} from 'react';
import {Box, List, Paper, TextField} from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {useNavigate} from 'react-router-dom';
import {PatientListItem} from '../components/lists/PatientListItem';
import { usePatientSearch } from '../hooks/usePatientSearch';

export const PatientSearch: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [showResults, setShowResults] = useState(false);
    const { patients, error, searchPatients } = usePatientSearch();
    const navigate = useNavigate();

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        searchPatients(value);
    };

    return (
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
            <Box sx={{width: '100%', maxWidth: 600, mx: 'auto', mt: 2}}>
                <TextField
                    fullWidth
                    label="Search Patients"
                    variant="outlined"
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    sx={{mb: 2}}
                    autoComplete="off"
                />
                {error && (
                    <Box sx={{ color: 'error.main', mb: 1 }}>
                        {error}
                    </Box>
                )}
                {showResults && patients.length > 0 && (
                    <Paper elevation={2}>
                        <List>
                            {patients.map((patient) => (
                                <PatientListItem
                                    key={patient.id}
                                    patient={patient}
                                    onPatientClick={(patientId) => navigate(`/patient/${patientId}`)}
                                />
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};
