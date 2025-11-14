import {useState} from 'react';
import {RestClient} from '../utils/restClient';
import {adaptCreateOperationTypePayload} from '../utils/CreateOperationTypeAdapter';
import {OperationType} from '../types/OperationType';
import {CreateOperationTypeFormData} from '../components/forms/CreateOperationTypeForm';

interface Props {
    onSuccess: () => void;
}

interface CreateOperationTypeStatus {
    createOperationType: (formData: CreateOperationTypeFormData) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
}

export const useCreateOperationType = ({onSuccess}: Props): CreateOperationTypeStatus => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOperationType = async (formData: CreateOperationTypeFormData) => {
        setError(null);
        setIsSubmitting(true);

        try {
            const payload = adaptCreateOperationTypePayload(formData);
            await RestClient.post<OperationType>('/api/operation-type', payload);
            onSuccess();
        } catch (err: any) {
            const errorMessage = 'An error occurred while creating the operation type';
            setError(errorMessage);
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
