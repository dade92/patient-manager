import { useState, useEffect } from 'react';
import { Invoice, InvoiceStatus } from '../types/invoice';
import { useCache } from '../context/CacheContext';
import { RestClient } from '../utils/restClient';

interface PatientInvoicesStatus {
    invoices: Invoice[];
    loading: boolean;
    error: string | null;
    updatingPaidInvoice: string;
    updatingCancelledInvoice: string;
    changeInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => Promise<void>;
    refetch: () => Promise<void>;
}

export const usePatientInvoices = (patientId: string, refreshTrigger?: number): PatientInvoicesStatus => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingPaidInvoice, setUpdatingPaidInvoice] = useState<string>('');
    const [updatingCancelledInvoice, setUpdatingCancelledInvoice] = useState<string>('');

    const { getCachedInvoicesForPatient, setCachedInvoicesForPatient } = useCache();

    const fetchInvoices = async () => {
        const cachedInvoices = getCachedInvoicesForPatient(patientId);
        if (cachedInvoices) {
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
        } finally {
            setLoading(false);
        }
    };

    const setUpdatingInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
        if (status === InvoiceStatus.PAID) {
            setUpdatingPaidInvoice(invoiceId);
            setUpdatingCancelledInvoice('');
        } else if (status === InvoiceStatus.CANCELLED) {
            setUpdatingCancelledInvoice(invoiceId);
            setUpdatingPaidInvoice('');
        }
    };

    const changeInvoiceStatus = async (invoiceId: string, status: InvoiceStatus) => {
        setUpdatingInvoiceStatus(invoiceId, status);

        try {
            const updatedInvoice = await RestClient.post<Invoice>(`/api/invoice/${invoiceId}/status`, { status });
            const updatedInvoices = invoices.map(invoice =>
                invoice.id === updatedInvoice.id ? updatedInvoice : invoice
            );
            setInvoices(updatedInvoices);
            setCachedInvoicesForPatient(patientId, updatedInvoices);
        } catch (err: any) {
            setError('An error occurred while updating the invoice');
        } finally {
            setUpdatingPaidInvoice('');
            setUpdatingCancelledInvoice('');
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [patientId, refreshTrigger]);

    return {
        invoices,
        loading,
        error,
        updatingPaidInvoice,
        updatingCancelledInvoice,
        changeInvoiceStatus,
        refetch: fetchInvoices
    };
};
