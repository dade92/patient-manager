import { useEffect, useState } from 'react';
import { Patient } from '../types/patient';
import { useCache } from '../context/CacheContext';
import { RestClient } from '../utils/restClient';

interface PatientStatus {
    patient: Patient | undefined;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updatePatient: (updatedPatient: Patient) => void;
}

export const usePatient = (patientId: string | undefined): PatientStatus => {
    const [patient, setPatient] = useState<Patient>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getCachedPatient, setCachedPatient } = useCache();

    const fetchPatient = async () => {
        if (!patientId) {
            setLoading(false);
            return;
        }

        const cachedPatient = getCachedPatient(patientId);
        if (cachedPatient) {
            setPatient(cachedPatient);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await RestClient.get<Patient>(`/api/patient/${patientId}`);
            setPatient(data);
            setCachedPatient(patientId, data);
        } catch (error: any) {
            if (error && error.status === 404) {
                setError(`Patient with ID ${patientId} was not found`);
            } else {
                setError('An error occurred while fetching the patient data');
            }
        } finally {
            setLoading(false);
        }
    };

    const updatePatient = (updatedPatient: Patient) => {
        if (!patientId) return;

        setPatient(updatedPatient);
        setCachedPatient(patientId, updatedPatient);
    };

    useEffect(() => {
        fetchPatient();
    }, [patientId]);

    return {
        patient,
        loading,
        error,
        refetch: fetchPatient,
        updatePatient
    };
};
