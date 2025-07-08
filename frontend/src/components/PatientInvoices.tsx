import React, {useEffect, useState} from 'react';
import {
    Alert,
    Badge,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Collapse,
    IconButton,
    List,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {Invoice, InvoiceStatus} from '../types/invoice';
import {InvoiceListItem} from './InvoiceListItem';

interface Props {
    patientId: string;
    refreshTrigger: number;
}

export const PatientInvoices: React.FC<Props> = ({patientId, refreshTrigger}) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [updatingInvoices, setUpdatingInvoices] = useState<Set<string>>(new Set());

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

    const markAsPaid = async (invoiceId: string) => {
        setUpdatingInvoices(prev => new Set(prev).add(invoiceId));

        try {
            const response = await fetch(`/api/invoice/${invoiceId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'PAID'
                })
            });

            if (response.ok) {
                setInvoices(prevInvoices =>
                    prevInvoices.map(invoice =>
                        invoice.id === invoiceId
                            ? {
                                ...invoice,
                                status: InvoiceStatus.PAID,
                            }
                            : invoice
                    )
                );
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update invoice status');
            }
        } catch (error) {
            setError('An error occurred while updating the invoice');
            console.error('Error updating invoice:', error);
        } finally {
            setUpdatingInvoices(prev => {
                const newSet = new Set(prev);
                newSet.delete(invoiceId);
                return newSet;
            });
        }
    };

    const pendingInvoicesCount = invoices.filter(invoice => invoice.status === InvoiceStatus.PENDING).length;
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
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        minWidth: '16px',
                                        height: '16px'
                                    }
                                }}
                            >
                                <Typography variant="h6">
                                    Invoices
                                </Typography>
                            </Badge>
                        ) : (
                            <Typography variant="h6">
                                Invoices
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
                                    <InvoiceListItem
                                        key={invoice.id}
                                        invoice={invoice}
                                        isLast={index === invoices.length - 1}
                                        isUpdating={updatingInvoices.has(invoice.id)}
                                        onMarkAsPaid={markAsPaid}
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
