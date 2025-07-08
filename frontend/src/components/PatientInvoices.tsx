import React, {useEffect, useState} from 'react';
import {Alert, Box, Card, CardContent, CircularProgress, Collapse, List, Typography} from '@mui/material';
import {Invoice, InvoiceStatus} from '../types/invoice';
import {InvoiceListItem} from './InvoiceListItem';
import {PatientInvoicesHeader} from './PatientInvoicesHeader';
import {useCache} from '../context/CacheContext';

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

    const { getCachedInvoicesForPatient, setCachedInvoicesForPatient } = useCache();

    const pendingInvoicesCount =
        invoices
            .filter(invoice => invoice.status === InvoiceStatus.PENDING)
            .length;

    const fetchInvoices = async () => {
        // First check the cache
        const cachedInvoices = getCachedInvoicesForPatient(patientId);
        if (cachedInvoices && cachedInvoices.length > 0) {
            setInvoices(cachedInvoices);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/invoice/patient/${patientId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.invoices) {
                    setInvoices(data.invoices);
                    // Cache the invoices
                    setCachedInvoicesForPatient(patientId, data.invoices);
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
                const updatedInvoices = invoices.map(invoice =>
                    invoice.id === invoiceId
                        ? {
                            ...invoice,
                            status: InvoiceStatus.PAID,
                          }
                        : invoice
                );

                setInvoices(updatedInvoices);
                setCachedInvoicesForPatient(patientId, updatedInvoices);
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

    return (
        <Card>
            <CardContent>
                <PatientInvoicesHeader
                    expanded={expanded}
                    hasPendingInvoices={pendingInvoicesCount > 0}
                    pendingInvoicesCount={pendingInvoicesCount}
                    onToggleExpanded={() => setExpanded(!expanded)}
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
