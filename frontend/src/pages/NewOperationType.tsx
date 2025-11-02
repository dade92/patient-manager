import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CreateOperationTypeForm } from '../components/forms/CreateOperationTypeForm';
import { OperationTypePriceList } from '../components/OperationTypePriceList';
import { OperationType } from '../types/OperationType';
import { RestClient } from '../utils/restClient';

export const NewOperationType: React.FC = () => {
    const navigate = useNavigate();
    const [operationTypes, setOperationTypes] = useState<OperationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOperationTypes();
    }, []);

    const fetchOperationTypes = async () => {
        try {
            setLoading(true);
            const response = await RestClient.get<{types: OperationType[]}>('/api/operation-types');
            setOperationTypes(response.types);
        } catch (err) {
            console.error('Failed to fetch operation types:', err);
            setError('Failed to load operation types');
        } finally {
            setLoading(false);
        }
    };

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
