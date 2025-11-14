import {useState} from 'react';
import {RestClient} from '../utils/restClient';
import {Patient} from '../types/patient';
import {NewPatientForm} from '../components/forms/CreatePatientForm';

interface CreatePatientStatus {
    createPatient: (form: NewPatientForm) => Promise<Patient | null>;
    error: string | null;
    isSubmitting: boolean;
}

export const useCreatePatient = (): CreatePatientStatus => {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createPatient = async (form: NewPatientForm): Promise<Patient | null> => {
        setError(null);
        setIsSubmitting(true);

        try {
            return await RestClient.post<Patient>('/api/patient', form);
        } catch (err: any) {
            setError('Failed to create patient. Please try again.');
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        createPatient,
        error,
        isSubmitting
    };
};
