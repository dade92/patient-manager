import {useState} from 'react';
import {RestClient} from '../utils/restClient';
import {Operation} from '../types/operation';
import {OperationForm} from '../components/forms/CreateOperationForm';
import {adaptOperationPayload} from '../utils/CreateOperationPayloadAdapter';
import {useCache} from '../context/CacheContext';

interface CreateOperationStatus {
    createOperation: (form: OperationForm) => Promise<Operation | null>;
    error: string | null;
    isSubmitting: boolean;
}

export const useCreateOperation = (patientId: string): CreateOperationStatus => {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {getCachedOperationsForPatient, setCachedOperationsForPatient} = useCache();

    const createOperation = async (form: OperationForm): Promise<Operation | null> => {
        setError(null);
        setIsSubmitting(true);

        try {
            const newOperation = await RestClient.post<Operation>(
                '/api/operation',
                adaptOperationPayload(form)
            );

            const cachedOperations = getCachedOperationsForPatient(patientId) || [];
            setCachedOperationsForPatient(patientId, [newOperation, ...cachedOperations]);
            return newOperation;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        createOperation,
        error,
        isSubmitting
    };
};
