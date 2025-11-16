import {useState} from 'react';
import {RestClient} from '../utils/restClient';
import {Operation} from '../types/operation';

interface UseAddNoteStatus {
    addNote: (content: string) => Promise<Operation | null>;
    error: string | null;
    isSubmitting: boolean;
}

export const useAddNote = (operationId: string): UseAddNoteStatus => {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addNote = async (content: string): Promise<Operation | null> => {
        setError(null);

        if (!content.trim()) {
            setError('Note content cannot be empty');
            return null;
        }

        setIsSubmitting(true);
        try {
            return await RestClient.post<Operation>(`/api/operation/${operationId}/notes`, {content});
        } catch (err: any) {
            setError('An error occurred while adding the note');
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        addNote,
        error,
        isSubmitting,
    };
};
