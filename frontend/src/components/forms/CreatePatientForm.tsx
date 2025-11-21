import React, {useState} from 'react';
import {Alert, Box, Button, Grid, TextField} from '@mui/material';
import {Patient} from "../../types/patient";
import {useCreatePatient} from "../../hooks/useCreatePatient";

export interface NewPatientForm {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    cityOfResidence: string;
    nationality: string;
    birthDate: string;
    taxCode: string;
    medicalHistory: string;
}

interface Props {
    onPatientCreated: (patient: Patient) => void;
    onCancel: () => void;
}

const DEFAULT_NATIONALITY = 'ITA';

const INITIAL_FORM = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    cityOfResidence: '',
    nationality: DEFAULT_NATIONALITY,
    birthDate: '',
    taxCode: '',
    medicalHistory: ''
};

export const CreatePatientForm: React.FC<Props> = ({
    onPatientCreated,
    onCancel
}) => {
    const [form, setForm] = useState<NewPatientForm>(INITIAL_FORM);
    const { createPatient, error, isSubmitting } = useCreatePatient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const patient = await createPatient(form);
        if (patient) {
            onPatientCreated(patient);
        }
    };

    return (
        <>
            {error && (
                <Alert severity="error" sx={{mb: 2}} data-testid="create-patient-error-alert">
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit} data-testid="create-patient-form">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            data-testid="name-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            data-testid="email-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="taxCode"
                            name="taxCode"
                            value={form.taxCode}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            data-testid="tax-code-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            data-testid="phone-number-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            data-testid="address-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="City"
                            name="cityOfResidence"
                            value={form.cityOfResidence}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            data-testid="city-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Nationality"
                            name="nationality"
                            value={form.nationality}
                            onChange={handleChange}
                            select={false}
                            disabled={isSubmitting}
                            data-testid="nationality-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Birth Date"
                            name="birthDate"
                            type="date"
                            value={form.birthDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={isSubmitting}
                            data-testid="birth-date-input"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Medical History"
                            name="medicalHistory"
                            value={form.medicalHistory}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            data-testid="medical-history-input"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                data-testid="cancel-button"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                data-testid="create-patient-button"
                            >
                                Create Patient
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};
