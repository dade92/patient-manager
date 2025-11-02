import { CreateOperationTypeForm } from '../components/forms/CreateOperationTypeForm';

export class CreateOperationTypeValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CreateOperationTypeValidationError';
    }
}

export const validateCreateOperationTypeForm = (formData: CreateOperationTypeForm): void => {
    if (!formData.type.trim()) {
        throw new CreateOperationTypeValidationError('Operation type name is required');
    }

    if (!formData.description.trim()) {
        throw new CreateOperationTypeValidationError('Description is required');
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new CreateOperationTypeValidationError('Amount must be a positive number');
    }
};
