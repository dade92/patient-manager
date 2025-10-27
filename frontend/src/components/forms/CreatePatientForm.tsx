import React, {useState} from 'react';
import {Alert, Box, Button, Grid, TextField} from '@mui/material';
import {RestClient} from '../../utils/restClient';

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
    onPatientCreated: (patient: any) => void;
    onCancel: () => void;
}

const DEFAULT_NATIONALITY = 'ITA';

const INITIAL_FORM: NewPatientForm = {
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
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const patient = await RestClient.post<any>('/api/patient', form);
            onPatientCreated(patient);
        } catch (err: any) {
            setError('Failed to create patient. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
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
