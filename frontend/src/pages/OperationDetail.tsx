import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {Operation} from '../types/operation';
import {useCache} from '../context/CacheContext';
import {formatDateTime} from '../utils/dateUtils';
import {ExpandableChip} from '../components/ExpandableChip';
import {OperationAssets} from '../components/OperationAssets';
import {OperationNotes} from '../components/OperationNotes';
import {AddNoteDialog} from '../components/AddNoteDialog';

export const OperationDetail: React.FC = () => {
    const {operationId} = useParams();
    const navigate = useNavigate();
    const [operation, setOperation] = useState<Operation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {getCachedOperation, setCachedOperation} = useCache();

    useEffect(() => {
        const fetchOperation = async () => {
            if (!operationId) return;

            const cachedOperation = getCachedOperation(operationId);
            if (cachedOperation) {
                setOperation(cachedOperation);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/operation/${operationId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOperation(data);
                    setCachedOperation(operationId, data);
                } else if (response.status === 404) {
                    setError(`Operation with ID ${operationId} was not found`);
                    setOperation(null);
                } else {
                    setError('An error occurred while fetching the operation data');
                }
            } catch (error) {
                setError('An error occurred while fetching the operation data');
                console.error('Error fetching operation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOperation();
    }, [operationId, getCachedOperation, setCachedOperation]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0 || !operationId) return;

        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploadLoading(true);
        setUploadError(null);

        try {
            const response = await fetch(`/api/operation/${operationId}/assets`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const updatedOperation = await response.json();
                setOperation(updatedOperation);

                if (setCachedOperation) {
                    setCachedOperation(operationId, updatedOperation);
                }
            } else {
                const errorData = await response.json();
                setUploadError(errorData.message || 'Failed to upload file');
            }
        } catch (error) {
            setUploadError('An error occurred while uploading the file');
            console.error('Error uploading file:', error);
        } finally {
            setUploadLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleNoteAdded = (updatedOperation: Operation) => {
        if (!operationId) return;

        setOperation(updatedOperation);
        setCachedOperation(operationId, updatedOperation);
    };

    if (loading) {
        return (
            <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBack}
                    sx={{mb: 2}}
                >
                    Back
                </Button>
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt: 4, px: 2}}>
            <Button
                startIcon={<ArrowBackIcon/>}
                onClick={handleBack}
                sx={{mb: 2}}
            >
                Back
            </Button>

            {error ? (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            ) : operation ? (
                <Card>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2}}>
                            <Typography variant="h5" component="div">
                                {operation.type}
                            </Typography>
                            <ExpandableChip
                                label={`Patient ID: ${operation.patientId}`}
                                color="primary"
                                onClick={() => navigate(`/patient/${operation.patientId}`)}
                                clickable
                                title={`Patient ID: ${operation.patientId}`}
                            />
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="textSecondary">Description</Typography>
                                <Typography variant="body1" paragraph>
                                    {operation.description}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">Executor</Typography>
                                <Typography variant="body1" paragraph>
                                    {operation.executor}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">Date</Typography>
                                <Typography variant="body1" paragraph>
                                    {formatDateTime(operation.createdAt)}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <OperationAssets assets={operation.assets} />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <Tooltip title="Upload File">
                                        <IconButton color="primary" onClick={() => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.click();
                                            }
                                        }}>
                                            <AddIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{display: 'none'}}
                                        onChange={handleFileUpload}
                                    />
                                    {uploadLoading && <CircularProgress size={24}/>}
                                    {uploadError && (
                                        <Alert severity="error" sx={{ml: 2}}>
                                            {uploadError}
                                        </Alert>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    startIcon={<NoteAddIcon/>}
                                    onClick={handleOpenDialog}
                                >
                                    Add Note
                                </Button>
                            </Grid>

                            <OperationNotes notes={operation.additionalNotes} />
                        </Grid>
                    </CardContent>
                </Card>
            ) : null}

            <AddNoteDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                operationId={operationId || ''}
                onNoteAdded={handleNoteAdded}
            />
        </Box>
    );
};
