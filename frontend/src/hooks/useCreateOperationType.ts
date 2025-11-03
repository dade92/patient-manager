import {useState} from 'react';
import {RestClient} from '../utils/restClient';
import {adaptCreateOperationTypePayload} from '../utils/CreateOperationTypeAdapter';
import {OperationType} from '../types/OperationType';
import {CreateOperationTypeForm} from '../components/forms/CreateOperationTypeForm';

interface Props {
    onSuccess: () => void;
    onError: (error: string) => void;
}

interface CreateOperationTypeStatus {
    createOperationType: (formData: CreateOperationTypeForm) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
}

export const useCreateOperationType = ({onSuccess, onError}: Props): CreateOperationTypeStatus => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOperationType = async (formData: CreateOperationTypeForm) => {
        setError(null);
        setIsSubmitting(true);

        try {
            const payload = adaptCreateOperationTypePayload(formData);
            await RestClient.post<OperationType>('/api/operation-type', payload);
            onSuccess?.();
        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred while creating the operation type';
            setError(errorMessage);
            onError?.(errorMessage);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        createOperationType,
        isSubmitting,
        error
    };
};
