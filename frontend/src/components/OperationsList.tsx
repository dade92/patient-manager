import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    List,
    ListItemButton,
    ListItemText,
    Divider
} from '@mui/material';
import { Operation } from '../types/operation';

interface Props {
    patientId: string;
}

export const OperationsList: React.FC<Props> = ({ patientId }) => {
    const navigate = useNavigate();
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOperations = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/operation/patient/${patientId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOperations(data.operations);
                } else {
                    setError('Failed to load operations');
                }
            } catch (error) {
                setError('An error occurred while fetching operations');
                console.error('Error fetching operations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOperations();
    }, [patientId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Operations History
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" my={2}>
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                ) : operations.length === 0 ? (
                    <Typography color="textSecondary">
                        No operations found for this patient.
                    </Typography>
                ) : (
                    <List>
                        {operations.map((operation, index) => (
                            <React.Fragment key={operation.id}>
                                <ListItemButton onClick={() => navigate(`/operation/${operation.id}`)}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1">
                                                {operation.type} - {operation.executor}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="textSecondary">
                                                    {operation.description}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {formatDate(operation.createdAt)}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItemButton>
                                {index < operations.length - 1 && <Divider/>}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );

}
