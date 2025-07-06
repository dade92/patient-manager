import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoteIcon from '@mui/icons-material/Note';
import {Operation} from '../types/operation';
import {formatDateTime} from '../utils/dateUtils';
import {useCache} from '../context/CacheContext';

interface Props {
    patientId: string;
    refreshTrigger: number;
}

export const PatientOperations: React.FC<Props> = ({patientId, refreshTrigger}) => {
    const navigate = useNavigate();
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {getCachedOperationsForPatient, setCachedOperationsForPatient} = useCache();

    const fetchOperations = async () => {
        if (!patientId) return;

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
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Typography variant="subtitle1">
                                                    {operation.type} - {operation.executor}
                                                </Typography>
                                                <Box sx={{display: 'flex', gap: 1}}>
                                                    <Chip
                                                        icon={<AttachFileIcon/>}
                                                        label={operation.assets ? operation.assets.length : 0}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        icon={<NoteIcon/>}
                                                        label={operation.additionalNotes ? operation.additionalNotes.length : 0}
                                                        size="small"
                                                        color="secondary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="textSecondary">
                                                    {operation.description}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {formatDateTime(operation.createdAt)}
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
