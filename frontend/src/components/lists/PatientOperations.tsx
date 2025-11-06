import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Card, CardContent, CircularProgress, Collapse, List, Typography} from '@mui/material';
import {OperationListItem} from './OperationListItem';
import {PatientOperationsHeader} from '../headers/PatientOperationsHeader';
import {usePatientOperations} from '../../hooks/usePatientOperations';

interface Props {
    patientId: string;
    refreshTrigger: number;
}

export const PatientOperations: React.FC<Props> = ({patientId, refreshTrigger}) => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const { operations, loading, error } = usePatientOperations(patientId, refreshTrigger);

    return (
        <Card>
            <CardContent>
                <PatientOperationsHeader
                    expanded={expanded}
                    onToggle={() => setExpanded(!expanded)}
                />

                <Collapse in={expanded}>
                    <Box sx={{mt: 2}}>
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
