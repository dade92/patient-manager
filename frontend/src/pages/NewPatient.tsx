import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Button, Card, CardContent, Grid, TextField, Typography,} from '@mui/material';

interface NewPatientForm {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    cityOfResidence: string;
    nationality: string;
    birthDate: string;
}

const initialForm: NewPatientForm = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    cityOfResidence: '',
    nationality: '',
    birthDate: '',
};

export const NewPatient: React.FC = () => {
    const [form, setForm] = useState<NewPatientForm>(initialForm);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

        try {
            const response = await fetch('/api/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const patient = await response.json();
                navigate(`/patient/${patient.id}`);
            } else {
                setError('Failed to create patient. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        New Patient
                    </Typography>
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
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
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
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Create Patient
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};
