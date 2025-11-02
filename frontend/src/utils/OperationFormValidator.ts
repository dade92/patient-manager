import {OperationForm} from "../components/forms/CreateOperationForm";

export class OperationValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OperationValidationError';
    }
}

export const validateOperationForm = (formData: OperationForm): void => {
    const invalidToothDetails = formData.toothDetails.filter(
        detail => !detail.toothNumber || detail.toothNumber === 0
    );

    if (invalidToothDetails.length > 0) {
        throw new OperationValidationError('Please select a tooth number for all tooth details before submitting.');
    }

    const invalidAmounts = formData.toothDetails.filter(
        detail => !detail.amount || parseFloat(detail.amount) <= 0
    );

    if (invalidAmounts.length > 0) {
        throw new OperationValidationError('All tooth details must have a valid amount greater than 0.');
    }
};
