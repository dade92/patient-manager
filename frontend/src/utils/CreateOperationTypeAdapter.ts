import {CreateOperationTypeForm} from '../components/forms/CreateOperationTypeForm';
import {validateCreateOperationTypeForm} from './CreateOperationTypeValidator';

export const adaptCreateOperationTypePayload = (formData: CreateOperationTypeForm) => {
    validateCreateOperationTypeForm(formData);

    return {
        type: formData.type.trim().toUpperCase(),
        description: formData.description.trim(),
        estimatedBaseCost: {
            amount: parseFloat(formData.amount),
            currency: formData.currency
        }
    };
};
