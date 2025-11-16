import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {OperationListItem} from '../../../components/lists/OperationListItem';
import {Operation, OperationNote} from '../../../types/operation';
import {Builder} from 'builder-pattern';

describe('OperationListItem', () => {
    it('renders operation info', () => {
        const onClick = jest.fn();
        render(<OperationListItem operation={OPERATION} isLast={false} onOperationClick={onClick}/>);

        expect(screen.getByTestId('operation-list-item-button')).toBeInTheDocument();
        expect(screen.getByTestId('operation-title')).toHaveTextContent(`${TYPE} - ${EXECUTOR}`);
        expect(screen.getByTestId('operation-assets-chip')).toHaveTextContent(ASSETS.length.toString());
        expect(screen.getByTestId('operation-notes-chip')).toHaveTextContent(NOTES.length.toString());
        expect(screen.getByTestId('operation-description')).toHaveTextContent(DESCRIPTION);
        expect(screen.getByTestId('operation-created-at')).toHaveTextContent(CREATED_AT);
        expect(screen.getByTestId('operation-divider')).toBeInTheDocument();
    });

    it('does not render divider for last item', () => {
        render(<OperationListItem operation={OPERATION} isLast={true} onOperationClick={jest.fn()}/>);
        expect(screen.queryByTestId('operation-divider')).toBeNull();
    });

    it('invokes callback when clicked', () => {
        const onClick = jest.fn();
        render(<OperationListItem operation={OPERATION} isLast={false} onOperationClick={onClick}/>);

        fireEvent.click(screen.getByTestId('operation-list-item-button'));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(OPERATION_ID);
    });

    it('renders zero counts when arrays are empty', () => {
        const EMPTY_OPERATION: Operation = Builder<Operation>()
            .id('OP-EMPTY')
            .patientId(PATIENT_ID)
            .type('CHECK')
            .description('Simple check')
            .executor('Dr House')
            .assets([])
            .additionalNotes([])
            .createdAt(CREATED_AT)
            .updatedAt(CREATED_AT)
            .estimatedCost({amount: 0, currency: 'EUR'})
            .patientOperationInfo({details: []})
            .build();

        render(<OperationListItem operation={EMPTY_OPERATION} isLast={false} onOperationClick={jest.fn()}/>);

        expect(screen.getByTestId('operation-assets-chip')).toHaveTextContent('0');
        expect(screen.getByTestId('operation-notes-chip')).toHaveTextContent('0');
    });

    const OPERATION_ID = 'OP-123';
    const PATIENT_ID = 'PAT-456';
    const TYPE = 'SURGERY';
    const EXECUTOR = 'Dr Strange';
    const DESCRIPTION = 'Tooth extraction of molar';
    const CREATED_AT = '2025-02-01T09:30:00';
    const NOTES: OperationNote[] = [
        {content: 'Initial note', createdAt: '2025-02-01T09:31:00'},
        {content: 'Follow-up required', createdAt: '2025-02-01T09:32:00'}
    ];
    const ASSETS = ['file1.png', 'file2.jpg', 'xray.dcm'];
    const OPERATION: Operation = Builder<Operation>()
        .id(OPERATION_ID)
        .patientId(PATIENT_ID)
        .type(TYPE)
        .description(DESCRIPTION)
        .executor(EXECUTOR)
        .assets(ASSETS)
        .additionalNotes(NOTES)
        .createdAt(CREATED_AT)
        .build();

});

