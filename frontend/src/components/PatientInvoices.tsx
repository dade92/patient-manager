import React, {useEffect, useState} from 'react';
import {
    Alert,
    Badge,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PaymentIcon from '@mui/icons-material/Payment';
import {Invoice} from '../types/invoice';
import {formatAmount} from '../utils/currencyUtils';
import {getInvoiceStatusColor} from '../utils/invoiceUtils';

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

    const pendingInvoicesCount = invoices.filter(invoice => invoice.status === 'PENDING').length;
    const hasPendingInvoices = pendingInvoicesCount > 0;

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
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        {hasPendingInvoices ? (
                            <Badge
                                badgeContent={pendingInvoicesCount}
                                color="warning"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: '#ff9800',
                                        color: 'white'
                                    }
                                }}
                            >
                                <Typography variant="h6">
                                    Invoices {invoices.length > 0 && `(${invoices.length})`}
                                </Typography>
                            </Badge>
                        ) : (
                            <Typography variant="h6">
                                Invoices {invoices.length > 0 && `(${invoices.length})`}
                            </Typography>
                        )}
                    </Box>
                    <IconButton size="small">
                        {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                    </IconButton>
                </Box>

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
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                            <PaymentIcon color="action"/>
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
                                                                color={getInvoiceStatusColor(invoice.status) as any}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{mt: 1}}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Operation ID: {invoice.operationId}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Created: {invoice.createdAt}
                                                        </Typography>
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
