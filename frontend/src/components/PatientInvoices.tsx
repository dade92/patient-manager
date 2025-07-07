import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
    Collapse,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PaymentIcon from '@mui/icons-material/Payment';

interface Invoice {
    id: string;
    operationId: string;
    amount: {
        amount: number;
        currency: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    patientId: string;
    refreshTrigger?: number;
}

export const PatientInvoices: React.FC<Props> = ({patientId, refreshTrigger}) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/invoice/patient/${patientId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.invoices) {
                    setInvoices(data.invoices);
                }
            } else {
                setError('Failed to load invoices');
            }
        } catch (error) {
            setError('An error occurred while fetching invoices');
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [patientId, refreshTrigger]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        },
                        borderRadius: 1,
                        p: 1,
                        mx: -1
                    }}
                    onClick={() => setExpanded(!expanded)}
                >
                    <Typography variant="h6">
                        Invoices {invoices.length > 0 && `(${invoices.length})`}
                    </Typography>
                    <IconButton size="small">
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>

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
                        ) : invoices.length === 0 ? (
                            <Typography color="textSecondary">
                                No invoices found for this patient.
                            </Typography>
                        ) : (
                            <List>
                                {invoices.map((invoice, index) => (
                                    <React.Fragment key={invoice.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <PaymentIcon color="action" />
                                                            <Typography variant="subtitle1">
                                                                {invoice.id}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                                            <Typography variant="h6" color="primary">
                                                                {formatAmount(invoice.amount.amount, invoice.amount.currency)}
                                                            </Typography>
                                                            <Chip
                                                                label={invoice.status}
                                                                size="small"
                                                                color={getStatusColor(invoice.status) as any}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Operation ID: {invoice.operationId}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Created: {invoice.createdAt}
                                                        </Typography>
                                                        {invoice.updatedAt !== invoice.createdAt && (
                                                            <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                                                                Updated: {invoice.updatedAt}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < invoices.length - 1 && <Divider/>}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};
