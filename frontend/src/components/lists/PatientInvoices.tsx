import React, {useEffect, useState} from 'react';
import {Alert, Box, Card, CardContent, CircularProgress, Collapse, List, Typography} from '@mui/material';
import {Invoice, InvoiceStatus} from '../../types/invoice';
import {InvoiceListItem} from './InvoiceListItem';
import {PatientInvoicesHeader} from '../headers/PatientInvoicesHeader';
import {useCache} from '../../context/CacheContext';
import { RestClient } from '../../utils/restClient';

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

    const {getCachedInvoicesForPatient, setCachedInvoicesForPatient} = useCache();

    const pendingInvoicesCount =
        invoices
            .filter(invoice => invoice.status === InvoiceStatus.PENDING)
            .length;

    const fetchInvoices = async () => {
        const cachedInvoices = getCachedInvoicesForPatient(patientId);
        if (cachedInvoices && cachedInvoices.length > 0) {
            setInvoices(cachedInvoices);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await RestClient.get<{ invoices: Invoice[] }>(`/api/invoice/patient/${patientId}`);
            if (data.invoices) {
                setInvoices(data.invoices);
                setCachedInvoicesForPatient(patientId, data.invoices);
            } else {
                setInvoices([]);
            }
        } catch (error: any) {
            setError('An error occurred while fetching invoices');
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async (invoiceId: string) => {
        setUpdatingInvoices(prev => new Set(prev).add(invoiceId));

        try {
            await RestClient.post(`/api/invoice/${invoiceId}/status`, { status: 'PAID' });
            const updatedInvoices = invoices.map(invoice =>
                invoice.id === invoiceId
                    ? { ...invoice, status: InvoiceStatus.PAID }
                    : invoice
            );
            setInvoices(updatedInvoices);
            setCachedInvoicesForPatient(patientId, updatedInvoices);
        } catch (err: any) {
            if (err && err.body && err.body.message) {
                setError(err.body.message);
            } else {
                setError('An error occurred while updating the invoice');
            }
            console.error('Error updating invoice:', err);
        } finally {
            setUpdatingInvoices(prev => {
                const newSet = new Set(prev);
                newSet.delete(invoiceId);
                return newSet;
            });
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [patientId, refreshTrigger]);

    return (
        <Card>
            <CardContent>
                <PatientInvoicesHeader
                    expanded={expanded}
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
