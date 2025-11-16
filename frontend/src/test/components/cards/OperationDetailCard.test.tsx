import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {OperationDetailCard} from '../../../components/cards/OperationDetailCard';
import {Operation} from '../../../types/operation';
import {formatAmount} from '../../../utils/currencyUtils';

jest.mock('../../../utils/currencyUtils', () => ({
    formatAmount: jest.fn()
}));

const mockedFormatAmount = formatAmount as jest.Mock;

describe('OperationDetailCard', () => {
    const OPERATION: Operation = {
        id: 'OP-001',
        patientId: 'PAT-001',
        type: 'SURGERY',
        description: 'Tooth extraction',
        executor: 'Dr Strange',
        assets: ['file1.png', 'file2.jpg'],
        additionalNotes: [{content: 'First note', createdAt: '2025-01-01T10:00:00'}],
        createdAt: '2025-02-01T09:30:00',
        updatedAt: '2025-02-01T09:45:00',
        estimatedCost: {amount: 1500, currency: 'EUR'},
        patientOperationInfo: {details: []}
    };

    it('renders correctly', () => {
        mockedFormatAmount.mockReturnValue('MOCKED_AMOUNT');
        render(
            <OperationDetailCard
                operation={OPERATION}
                onAddAsset={async () => {}}
                onAddNote={() => {}}
                onCreateInvoice={() => {}}
                onPatientIdClick={() => {}}
            />
        );

        expect(screen.getByTestId('operation-detail-card')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type')).toHaveTextContent('SURGERY');
        expect(screen.getByTestId('operation-patient-id-chip')).toHaveTextContent('PAT-001');
        expect(screen.getByTestId('operation-description')).toHaveTextContent('Tooth extraction');
        expect(screen.getByTestId('operation-executor')).toHaveTextContent('Dr Strange');
        expect(screen.getByTestId('operation-date')).toHaveTextContent('2025-02-01T09:30:00');
        expect(screen.getByTestId('operation-estimated-cost')).toHaveTextContent('MOCKED_AMOUNT');
        expect(mockedFormatAmount).toHaveBeenCalledWith(1500, 'EUR');
        expect(screen.getByTestId('operation-create-invoice-button')).toBeInTheDocument();
    });

    it('fires patient id click handler', () => {
        const onPatientIdClick = jest.fn();
        render(
            <OperationDetailCard
                operation={OPERATION}
                onAddAsset={jest.fn()}
                onAddNote={jest.fn()}
                onCreateInvoice={jest.fn()}
                onPatientIdClick={onPatientIdClick}
            />
        );
        fireEvent.click(screen.getByTestId('operation-patient-id-chip'));
        expect(onPatientIdClick).toHaveBeenCalledWith('PAT-001');
        expect(onPatientIdClick).toHaveBeenCalledTimes(1);
    });

    it('fires create invoice handler', () => {
        const onCreateInvoice = jest.fn();
        render(
            <OperationDetailCard
                operation={OPERATION}
                onAddAsset={jest.fn()}
                onAddNote={jest.fn()}
                onCreateInvoice={onCreateInvoice}
                onPatientIdClick={jest.fn()}
            />
        );
        fireEvent.click(screen.getByTestId('operation-create-invoice-button'));
        expect(onCreateInvoice).toHaveBeenCalledTimes(1);
    });
});
