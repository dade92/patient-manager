import { useEffect, useState } from 'react';
import { Operation } from '../types/operation';
import { useCache } from '../context/CacheContext';
import { RestClient } from '../utils/restClient';

interface OperationStatus {
    operation: Operation | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateOperation: (updatedOperation: Operation) => void;
}

export const useOperation = (operationId: string | undefined): OperationStatus => {
    const [operation, setOperation] = useState<Operation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        getCachedOperation,
        setCachedOperation,
        getCachedOperationsForPatient,
        setCachedOperationsForPatient
    } = useCache();

    const updateOperationInPatientCache = (updatedOperation: Operation) => {
        if (!operation) return;

        const patientId = operation.patientId;
        const cachedOperations = getCachedOperationsForPatient(patientId);

        if (cachedOperations && cachedOperations.length > 0) {
            const updatedOperations = cachedOperations.map(op =>
                op.id === updatedOperation.id ? updatedOperation : op
            );
            setCachedOperationsForPatient(patientId, updatedOperations);
        }
    };

    const fetchOperation = async () => {
        if (!operationId) {
            setLoading(false);
            return;
        }

        const cachedOperation = getCachedOperation(operationId);
        if (cachedOperation) {
            setOperation(cachedOperation);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await RestClient.get<Operation>(`/api/operation/${operationId}`);
            setOperation(data);
            setCachedOperation(operationId, data);
        } catch (error: any) {
            if (error && error.status === 404) {
                setError(`Operation with ID ${operationId} was not found`);
                setOperation(null);
            } else {
                setError('An error occurred while fetching the operation data');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateOperation = (updatedOperation: Operation) => {
        if (!operationId) return;

        setOperation(updatedOperation);
        setCachedOperation(operationId, updatedOperation);
        updateOperationInPatientCache(updatedOperation);
    };

    useEffect(() => {
        fetchOperation();
    }, [operationId]);

    return {
        operation,
        loading,
        error,
        refetch: fetchOperation,
        updateOperation
    };
};
