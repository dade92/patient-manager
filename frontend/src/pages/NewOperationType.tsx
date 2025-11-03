import React from 'react';
import {
    Container,
    Paper,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CreateOperationTypeForm } from '../components/forms/CreateOperationTypeForm';
import { OperationTypePriceList } from '../components/lists/OperationTypePriceList';
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
            <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
                <Grid item xs={12} md={6}>
                    <CreateOperationTypeForm
                        onOperationTypeCreated={handleOperationTypeCreated}
                        onCancel={handleCancel}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ height: 'fit-content' }}>
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
