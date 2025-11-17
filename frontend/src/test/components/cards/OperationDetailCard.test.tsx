import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {OperationDetailCard} from '../../../components/cards/OperationDetailCard';
import {Operation} from '../../../types/operation';
import {formatAmount} from '../../../utils/currencyUtils';
import {Builder} from 'builder-pattern';

jest.mock('../../../utils/currencyUtils', () => ({
    formatAmount: jest.fn()
}));

const mockedFormatAmount = formatAmount as jest.Mock;

describe('OperationDetailCard', () => {
    const onPatientIdClick = jest.fn();
    const onCreateInvoice = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('renders correctly', () => {
        mockedFormatAmount.mockReturnValue(MOCKED_FORMATTED_AMOUNT);
        render(
            <OperationDetailCard
                operation={OPERATION}
                onAddAsset={jest.fn()}
                onAddNote={jest.fn()}
                onCreateInvoice={onCreateInvoice}
                onPatientIdClick={onPatientIdClick}
            />
        );

        expect(screen.getByTestId('operation-detail-card')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type')).toHaveTextContent(TYPE);
        expect(screen.getByTestId('operation-patient-id-chip')).toHaveTextContent(PATIENT_ID);
        expect(screen.getByTestId('operation-description')).toHaveTextContent(DESCRIPTION);
        expect(screen.getByTestId('operation-executor')).toHaveTextContent(EXECUTOR);
        expect(screen.getByTestId('operation-date')).toHaveTextContent(CREATED_AT);
        expect(screen.getByTestId('operation-estimated-cost')).toHaveTextContent(MOCKED_FORMATTED_AMOUNT);
        expect(mockedFormatAmount).toHaveBeenCalledWith(ESTIMATED_AMOUNT, ESTIMATED_CURRENCY);
        expect(screen.getByTestId('operation-create-invoice-button')).toBeInTheDocument();

        //TODO check the other FC like tooth details, assets, notes...
    });

    it('fires patient id click handler', () => {
        render(
            <OperationDetailCard
                operation={OPERATION}
                onAddAsset={jest.fn()}
                onAddNote={jest.fn()}
                onCreateInvoice={onCreateInvoice}
                onPatientIdClick={onPatientIdClick}
            />
        );
        fireEvent.click(screen.getByTestId('operation-patient-id-chip'));
        expect(onPatientIdClick).toHaveBeenCalledWith(PATIENT_ID);
        expect(onPatientIdClick).toHaveBeenCalledTimes(1);
    });

    it('fires create invoice handler', () => {
        render(
            <OperationDetailCard
                operation={OPERATION}
                onAddAsset={jest.fn()}
                onAddNote={jest.fn()}
                onCreateInvoice={onCreateInvoice}
                onPatientIdClick={onPatientIdClick}
            />
        );
        fireEvent.click(screen.getByTestId('operation-create-invoice-button'));
        expect(onCreateInvoice).toHaveBeenCalledTimes(1);
    });

    const OP_ID = 'OP-001';
    const PATIENT_ID = 'PAT-001';
    const TYPE = 'SURGERY';
    const DESCRIPTION = 'Tooth extraction';
    const EXECUTOR = 'Dr Strange';
    const ASSET_1 = 'file1.png';
    const ASSET_2 = 'file2.jpg';
    const NOTE_CONTENT = 'First note';
    const NOTE_CREATED_AT = '2025-01-01T10:00:00';
    const CREATED_AT = '2025-02-01T09:30:00';
    const UPDATED_AT = '2025-02-01T09:45:00';
    const ESTIMATED_AMOUNT = 1500;
    const ESTIMATED_CURRENCY = 'EUR';
    const MOCKED_FORMATTED_AMOUNT = 'MOCKED_AMOUNT';

    const OPERATION: Operation = Builder<Operation>()
        .id(OP_ID)
        .patientId(PATIENT_ID)
        .type(TYPE)
        .description(DESCRIPTION)
        .executor(EXECUTOR)
        .assets([ASSET_1, ASSET_2])
        .additionalNotes([{content: NOTE_CONTENT, createdAt: NOTE_CREATED_AT}])
        .createdAt(CREATED_AT)
        .updatedAt(UPDATED_AT)
        .estimatedCost({amount: ESTIMATED_AMOUNT, currency: ESTIMATED_CURRENCY})
        .patientOperationInfo({details: []})
        .build();
});
