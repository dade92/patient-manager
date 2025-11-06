import { useState, useEffect } from 'react';
import { Operation } from '../types/operation';
import { useCache } from '../context/CacheContext';
import { RestClient } from '../utils/restClient';

interface UsePatientOperationsResult {
    operations: Operation[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const usePatientOperations = (patientId: string, refreshTrigger?: number): UsePatientOperationsResult => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getCachedOperationsForPatient, setCachedOperationsForPatient } = useCache();

    const fetchOperations = async () => {
        const cachedOperations = getCachedOperationsForPatient(patientId);
        if (cachedOperations) {
            setOperations(cachedOperations);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await RestClient.get<{ operations: Operation[] }>(`/api/operation/patient/${patientId}`);
            if (data.operations) {
                setCachedOperationsForPatient(patientId, data.operations);
                setOperations(data.operations);
            } else {
                setOperations([]);
            }
        } catch (error: any) {
            if (error && error.status === 404) {
                setOperations([]);
            } else {
                setError('An error occurred while fetching operations');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOperations();
    }, [patientId, refreshTrigger]);

    return {
        operations,
        loading,
        error,
        refetch: fetchOperations
    };
};
