import { useState } from 'react';
import {Operation} from "../types/operation";

interface Props {
    onSuccess: (data: any) => void;
}

interface FileUploadStatus {
    uploading: boolean;
    error: string | null;
    uploadFile: (operationId: string, file: File) => Promise<void>;
}

export const useFileUpload = ({ onSuccess }: Props): FileUploadStatus => {
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
                throw uploadError;
            }

            const updatedOperation: Operation = await response.json();
            onSuccess(updatedOperation);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
            setError(errorMessage);
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
