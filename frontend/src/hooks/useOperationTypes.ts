import { useEffect, useState } from 'react';
import { OperationType } from '../types/OperationType';
import { RestClient } from '../utils/restClient';

interface UseOperationTypesReturn {
    operationTypes: OperationType[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useOperationTypes = (): UseOperationTypesReturn => {
    const [operationTypes, setOperationTypes] = useState<OperationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOperationTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await RestClient.get<{types: OperationType[]}>('/api/operation-types');
            setOperationTypes(response.types);
        } catch (err) {
            console.error('Failed to fetch operation types:', err);
            setError('Failed to load operation types');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOperationTypes();
    }, []);

    return {
        operationTypes,
        loading,
        error,
        refetch: fetchOperationTypes
    };
};
