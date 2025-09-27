import React, {useEffect, useState} from 'react';
import {Box, List, Paper, TextField} from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {useNavigate} from 'react-router-dom';
import {Patient} from '../types/patient';
import {PatientListItem} from './lists/PatientListItem';
import { RestClient } from '../utils/restClient';

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
            const data = await RestClient.get<{ patients: Patient[] }>(`/api/patient/search?name=${encodeURIComponent(searchInput)}`);
            setPatients(data.patients);
        } catch (error: any) {
            if (error && error.status === 404) {
                setPatients([]);
            } else {
                console.error('Error searching patients:', error);
            }
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
