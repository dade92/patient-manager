import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Card, CardContent, CircularProgress, Collapse, List, Typography} from '@mui/material';
import {Operation} from '../types/operation';
import {useCache} from '../context/CacheContext';
import {OperationListItem} from './OperationListItem';
import {PatientOperationsHeader} from './PatientOperationsHeader';

interface Props {
    patientId: string;
    refreshTrigger: number;
}

export const PatientOperations: React.FC<Props> = ({patientId, refreshTrigger}) => {
    const navigate = useNavigate();
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const {getCachedOperationsForPatient, setCachedOperationsForPatient} = useCache();

    const fetchOperations = async () => {
        const cachedOperations = getCachedOperationsForPatient(patientId);
        if (cachedOperations && cachedOperations.length > 0) {
            setOperations(cachedOperations);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/operation/patient/${patientId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.operations) {
                    setCachedOperationsForPatient(patientId, data.operations);
                    setOperations(data.operations);
                }
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

    useEffect(() => {
        fetchOperations();
    }, [patientId, refreshTrigger]);

    return (
        <Card>
            <CardContent>
                <PatientOperationsHeader
                    expanded={expanded}
                    onToggle={() => setExpanded(!expanded)}
                />

                <Collapse in={expanded}>
                    <Box sx={{ mt: 2 }}>
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
                                    <OperationListItem
                                        key={operation.id}
                                        operation={operation}
                                        isLast={index === operations.length - 1}
                                        onOperationClick={(operationId: string) => {
                                            navigate(`/operation/${operationId}`);
                                        }}
                                    />
                                ))}
                            </List>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};
