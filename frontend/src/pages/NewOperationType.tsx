import React from 'react';
import {
    Container,
    Paper,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CreateOperationTypeForm } from '../components/forms/CreateOperationTypeForm';
import { OperationTypePriceList } from '../components/OperationTypePriceList';
import { useOperationTypes } from '../hooks/useOperationTypes';

export const NewOperationType: React.FC = () => {
    const navigate = useNavigate();
    const { operationTypes, loading, error} = useOperationTypes();

    const handleOperationTypeCreated = () => {
        navigate('/');
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <CreateOperationTypeForm
                        onOperationTypeCreated={handleOperationTypeCreated}
                        onCancel={handleCancel}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ mt: 2 }}>
                        <OperationTypePriceList
                            operationTypes={operationTypes}
                            loading={loading}
                            error={error}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
