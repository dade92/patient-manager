import { useState, useEffect } from 'react';
import { Patient } from '../types/patient';
import { RestClient } from '../utils/restClient';

const SEARCH_TIMEOUT = 400;

interface UsePatientSearchReturn {
    patients: Patient[];
    loading: boolean;
    error: string | null;
    searchPatients: (query: string) => void;
}

export const usePatientSearch = (): UsePatientSearchReturn => {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const performSearch = async (query: string) => {
        if (query.length < 2) {
            setPatients([]);
            setError(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await RestClient.get<{ patients: Patient[] }>(`/api/patient/search?name=${encodeURIComponent(query)}`);
            setPatients(data.patients);
        } catch (error: any) {
            if (error && error.status === 404) {
                setPatients([]);
            } else {
                setError('An error occurred while searching for patients.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => performSearch(searchQuery), SEARCH_TIMEOUT);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const searchPatients = (query: string) => {
        setSearchQuery(query);
    };

    return {
        patients,
        loading,
        error,
        searchPatients
    };
};
