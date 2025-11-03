import {useState} from 'react';
import {RestClient} from '../utils/restClient';

interface Props {
    onSuccess: () => void;
    onError: (error: string) => void;
}

interface DeletePatientStatus {
    deletePatient: (patientId: string) => Promise<void>;
    isDeleting: boolean;
    error: string | null;
}

export const useDeletePatient = ({onSuccess, onError}: Props): DeletePatientStatus => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletePatient = async (patientId: string) => {
        setIsDeleting(true);
        setError(null);

        try {
            await RestClient.post(`/api/patient/delete/${patientId}`, {});
            onSuccess?.();
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to delete patient';
            setError(errorMessage);
            onError?.(errorMessage);
            throw error;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deletePatient,
        isDeleting,
        error
    };
};
