import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {CreateOperationTypeForm} from '../../../components/forms/CreateOperationTypeForm';
const {useCreateOperationType} = require('../../../hooks/useCreateOperationType');

const createOperationType = jest.fn();
const CREATE_OPERATION_TYPE_STATUS = {
    createOperationType: createOperationType,
    error: null as string | null,
    isSubmitting: false
};

jest.mock('../../../hooks/useCreateOperationType', () => ({
    useCreateOperationType: jest.fn(() => CREATE_OPERATION_TYPE_STATUS)
}));

describe('CreateOperationTypeForm', () => {
    const onOperationTypeCreated = jest.fn();
    const onCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        CREATE_OPERATION_TYPE_STATUS.error = null;
        CREATE_OPERATION_TYPE_STATUS.isSubmitting = false;
        useCreateOperationType.mockReturnValue(CREATE_OPERATION_TYPE_STATUS);
    });

    it('renders all necessary components', () => {
        render(<CreateOperationTypeForm onOperationTypeCreated={onOperationTypeCreated} onCancel={onCancel}/>);

        expect(screen.getByTestId('create-operation-type-form')).toBeInTheDocument();
        expect(screen.getByTestId('type-input')).toBeInTheDocument();
        expect(screen.getByTestId('description-input')).toBeInTheDocument();
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
        expect(screen.getByTestId('currency-input')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
        expect(screen.getByTestId('create-operation-type-button')).toBeInTheDocument();

        expect(screen.queryByTestId('create-operation-type-error-alert')).not.toBeInTheDocument();
    });

    it('calls useCreateOperationType hook and onOperationTypeCreated when form is submitted successfully', async () => {
        createOperationType.mockResolvedValue(undefined);

        render(
            <CreateOperationTypeForm
                onOperationTypeCreated={onOperationTypeCreated}
                onCancel={onCancel}
            />
        );

        compileForm(formData);

        fireEvent.click(screen.getByTestId('create-operation-type-button'));

        await waitFor(() => {
            expect(useCreateOperationType).toHaveBeenCalledWith({
                onSuccess: onOperationTypeCreated
            });
            expect(createOperationType).toHaveBeenCalledWith(formData);
            expect(createOperationType).toHaveBeenCalledTimes(1);
        });
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<CreateOperationTypeForm onOperationTypeCreated={onOperationTypeCreated} onCancel={onCancel}/>);

        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOperationTypeCreated).not.toHaveBeenCalled();
    });

    const TYPE = 'CLEANING';
    const DESCRIPTION = 'Regular dental cleaning';
    const AMOUNT = '50.00';
    const CURRENCY = 'EUR';
    const formData = {
        type: TYPE,
        description: DESCRIPTION,
        amount: AMOUNT,
        currency: CURRENCY
    };
    const compileForm = (formData: {
        type: string;
        description: string;
        amount: string;
        currency: string;
    }) => {
        fireEvent.change(screen.getByTestId('type-input').querySelector('input')!, {target: {value: formData.type}});
        fireEvent.change(screen.getByTestId('description-input').querySelector('textarea')!, {target: {value: formData.description}});
        fireEvent.change(screen.getByTestId('amount-input').querySelector('input')!, {target: {value: formData.amount}});
        fireEvent.change(screen.getByTestId('currency-input').querySelector('input')!, {target: {value: formData.currency}});
    };
});
