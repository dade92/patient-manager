import {useState} from 'react';
import {RestClient} from '../utils/restClient';
import {Invoice} from '../types/invoice';
import {Money} from '../types/Money';
import {useCache} from '../context/CacheContext';

interface CreateInvoicePayload {
    operationId: string;
    patientId: string;
    amount: Money;
}

interface CreateInvoiceOptions {
    patientId: string;
}

interface CreateInvoiceStatus {
    createInvoice: (payload: CreateInvoicePayload) => Promise<Invoice | null>;
    error: string | null;
    isSubmitting: boolean;
}

export const useCreateInvoice = (options: CreateInvoiceOptions): CreateInvoiceStatus => {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addCachedInvoiceForPatient } = useCache();

    const createInvoice = async (payload: CreateInvoicePayload): Promise<Invoice | null> => {
        setError(null);
        setIsSubmitting(true);

        try {
            const newInvoice = await RestClient.post<Invoice>('/api/invoice', payload);

            addCachedInvoiceForPatient(options.patientId, newInvoice);

            return newInvoice;
        } catch (err: any) {
            setError('An error occurred while creating the invoice');
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        createInvoice,
        error,
        isSubmitting
    };
};
