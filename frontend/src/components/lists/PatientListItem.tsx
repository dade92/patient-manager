import React from 'react';
import {ListItemButton, ListItemText} from '@mui/material';
import {Patient} from '../../types/patient';

interface Props {
    patient: Patient;
    onPatientClick: (patientId: string) => void;
}

export const PatientListItem: React.FC<Props> = ({patient, onPatientClick}) =>
    (
        <ListItemButton
            key={patient.id}
            onClick={() => onPatientClick(patient.id)}
        >
            <ListItemText
                primary={patient.name}
                secondary={`${patient.taxCode} • ${patient.email}`}
            />
        </ListItemButton>
    );
