import { useState } from 'react';

interface Props {
    onSuccess: (data: any) => void;
    onError: (error: Error) => void;
}

interface UseFileUploadReturn {
    uploading: boolean;
    error: string | null;
    uploadFile: (operationId: string, file: File) => Promise<void>;
}

export const useFileUpload = ({ onSuccess, onError }: Props): UseFileUploadReturn => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (operationId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setError(null);

        try {
            const response = await fetch(`/api/operation/${operationId}/assets`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to upload file';
                const uploadError = new Error(errorMessage);
                setError(errorMessage);
                onError?.(uploadError);
                throw uploadError;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
            setError(errorMessage);
            onError?.(error as Error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    return {
        uploading,
        error,
        uploadFile
    };
};
