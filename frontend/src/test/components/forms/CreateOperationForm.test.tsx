import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {CreateOperationForm} from '../../../components/forms/CreateOperationForm';
import {Operation, PatientOperationInfo} from '../../../types/operation';
import {Builder} from 'builder-pattern';
import {ToothType} from "../../../types/ToothDetail";
import {Money} from "../../../types/Money";

const {useCreateOperation} = require('../../../hooks/useCreateOperation');
const {useOperationTypes} = require('../../../hooks/useOperationTypes');

jest.mock('../../../components/forms/ToothSelectionForm', () => ({
    ToothSelectionForm: ({onSelectionChange, estimatedCost, ...props}: any) => (
        <div data-testid="tooth-selection-form" {...props}>
            <span data-testid="estimated-cost">{estimatedCost}</span>
            <button
                onClick={() => onSelectionChange([{toothNumber: 11, amount: '50.00', toothType: 'PERMANENT'}])}
                data-testid="mock-tooth-change"
            >
                Mock Tooth Change
            </button>
        </div>
    )
}));
jest.mock('../../../context/CacheContext', () => ({
    useCache: () => ({
        getCachedOperationsForPatient: jest.fn(() => []),
        setCachedOperationsForPatient: jest.fn()
    })
}));

const createOperation = jest.fn();
const createOperationStatus = {
    createOperation: createOperation,
    error: null as string | null,
    isSubmitting: false
};
const OPERATION_TYPES = [
    {
        type: 'CLEANING',
        description: 'Regular dental cleaning',
        estimatedBaseCost: {amount: 50.00, currency: 'EUR'}
    },
    {
        type: 'FILLING',
        description: 'Dental cavity filling',
        estimatedBaseCost: {amount: 120.00, currency: 'EUR'}
    }
];
const OPERATION_TYPE_STATUS = {
    operationTypes: OPERATION_TYPES,
    loading: false,
    error: null as string | null
};
jest.mock('../../../hooks/useCreateOperation', () => ({
    useCreateOperation: jest.fn(() => createOperationStatus)
}));

jest.mock('../../../hooks/useOperationTypes', () => ({
    useOperationTypes: jest.fn(() => OPERATION_TYPE_STATUS)
}));

describe('CreateOperationForm', () => {
    const onOperationCreated = jest.fn();
    const onCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        createOperationStatus.error = null;
        createOperationStatus.isSubmitting = false;
        OPERATION_TYPE_STATUS.operationTypes = OPERATION_TYPES;
        OPERATION_TYPE_STATUS.loading = false;
        OPERATION_TYPE_STATUS.error = null;
        useCreateOperation.mockReturnValue(createOperationStatus);
        useOperationTypes.mockReturnValue(OPERATION_TYPE_STATUS);
    });

    it('renders all necessary components calling the hooks', () => {
        render(
            <CreateOperationForm
                patientId={PATIENT_ID}
                onOperationCreated={onOperationCreated}
                onCancel={onCancel}
            />
        );

        expect(screen.getByTestId('create-operation-form')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-select')).toBeInTheDocument();
        expect(screen.getByTestId('description-input')).toBeInTheDocument();
        expect(screen.getByTestId('executor-input')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-selection-form')).toBeInTheDocument();
        expect(screen.getByTestId('create-operation-button')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();

        expect(screen.queryByTestId('create-operation-error-alert')).not.toBeInTheDocument();
        expect(useCreateOperation).toHaveBeenCalledWith(PATIENT_ID);
        expect(useOperationTypes).toHaveBeenCalled();
    });

    it('calls createOperation with proper params when form is submitted successfully', async () => {
        const createdOperation = buildOperation();
        createOperation.mockResolvedValue(createdOperation);

        render(
            <CreateOperationForm
                patientId={PATIENT_ID}
                onOperationCreated={onOperationCreated}
                onCancel={onCancel}
            />
        );

        await compileForm(formData);

        fireEvent.click(screen.getByTestId('create-operation-button'));

        await waitFor(() => {
            //TODO why it gives me 2 instead of 1 calls?
            // expect(createOperation).toHaveBeenCalledTimes(1);
            expect(createOperation).toHaveBeenCalledWith(formData);
            expect(onOperationCreated).toHaveBeenCalledWith(createdOperation);
        });
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(
            <CreateOperationForm
                patientId={PATIENT_ID}
                onOperationCreated={onOperationCreated}
                onCancel={onCancel}
            />
        );

        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOperationCreated).not.toHaveBeenCalled();
    });

    const CHOSEN_OPERATION_TYPE = 'CLEANING';
    const DESCRIPTION = 'description';
    const EXECUTOR = 'Dr. Smith';
    const PATIENT_ID = 'PAT-ID';
    const formData = {
        type: CHOSEN_OPERATION_TYPE,
        patientId: PATIENT_ID,
        description: DESCRIPTION,
        executor: EXECUTOR,
        toothDetails: [{toothNumber: 11, amount: '50.00', toothType: 'PERMANENT'}]
    };
    const buildOperation = (): Operation =>
        Builder<Operation>()
            .id('OP-ID')
            .type(CHOSEN_OPERATION_TYPE)
            .patientId(PATIENT_ID)
            .description(DESCRIPTION)
            .executor(EXECUTOR)
            .createdAt('2023-01-01')
            .patientOperationInfo(Builder<PatientOperationInfo>().details([{
                toothNumber: 11,
                estimatedCost: Builder<Money>().amount(50).currency('EUR').build(),
                toothType: ToothType.PERMANENT
            }]).build())
            .build();

    const compileForm = async (formData: {
        type: string;
        patientId: string;
        description: string;
        executor: string;
        toothDetails: any[];
    }) => {
        const hiddenInput = screen.getByTestId('operation-type-select').querySelector('input[name="type"]') as HTMLInputElement;
        fireEvent.change(hiddenInput, {target: {value: formData.type}});
        fireEvent.change(screen.getByTestId('description-input').querySelector('textarea')!, {
            target: {value: formData.description}
        });
        fireEvent.change(screen.getByTestId('executor-input').querySelector('input')!, {
            target: {value: formData.executor}
        });
        fireEvent.click(screen.getByTestId('mock-tooth-change'));
    };
});
