import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
import { Operation } from '../types/operation';
import { formatDateTime } from '../utils/dateUtils';
import { ExpandableChip } from './ExpandableChip';
import { OperationAssets } from './OperationAssets';
import { OperationNotes } from './OperationNotes';

interface Props {
    operation: Operation;
    onAddAsset: (file: File) => Promise<void>;
    onAddNote: () => void;
    onCreateInvoice: () => void;
}

export const OperationDetailCard: React.FC<Props> = ({
    operation,
    onAddAsset,
    onAddNote,
    onCreateInvoice
}) => {
    const navigate = useNavigate();

    return (
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

                    <OperationAssets
                        assets={operation.assets}
                        onAddAsset={onAddAsset}
                    />

                    <OperationNotes
                        notes={operation.additionalNotes}
                        onAddNote={onAddNote}
                    />

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onCreateInvoice}
                                sx={{
                                    backgroundColor: '#ff6b35',
                                    '&:hover': { backgroundColor: '#e55a2b' },
                                    fontWeight: 'bold'
                                }}
                            >
                                Create Invoice
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
