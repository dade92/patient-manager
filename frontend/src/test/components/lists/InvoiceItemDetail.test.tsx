import React from 'react';
import {render, screen} from '@testing-library/react';
import {InvoiceItemDetail} from '../../../components/lists/InvoiceItemDetail';
import {Invoice, InvoiceStatus} from '../../../types/invoice';
import {Builder} from 'builder-pattern';
import {idFormatter} from '../../../utils/idFormatter';

jest.mock('../../../utils/idFormatter', () => ({
    idFormatter: jest.fn()
}));

const mockedIdFormatter = idFormatter as jest.Mock;

describe('InvoiceItemDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedIdFormatter.mockImplementation((value: string) => `FMT(${value})`);
    });

    it('renders pending invoice without paid-at line', () => {
        const invoice = anInvoiceWithStatus(InvoiceStatus.PENDING);

        render(<InvoiceItemDetail invoice={invoice}/>);

        expect(screen.getByTestId('invoice-item-detail')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-id')).toHaveTextContent(`FMT(${BASE_ID})`);
        expect(screen.getByTestId('operation-id')).toHaveTextContent(`Operation: FMT(${BASE_OPERATION_ID})`);
        expect(screen.getByTestId('created-at')).toHaveTextContent(`Created at: ${CREATED_AT}`);
        expect(screen.queryByTestId('paid-at')).toBeNull();
        expect(mockedIdFormatter).toHaveBeenCalledWith(BASE_ID);
        expect(mockedIdFormatter).toHaveBeenCalledWith(BASE_OPERATION_ID);
    });

    it('renders paid invoice with paid-at line', () => {
        const invoice = anInvoiceWithStatus(InvoiceStatus.PAID);

        render(<InvoiceItemDetail invoice={invoice}/>);

        expect(screen.getByTestId('invoice-item-detail')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-id')).toHaveTextContent(`FMT(${BASE_ID})`);
        expect(screen.getByTestId('operation-id')).toHaveTextContent(`Operation: FMT(${BASE_OPERATION_ID})`);
        expect(screen.getByTestId('created-at')).toHaveTextContent(`Created at: ${CREATED_AT}`);
        expect(screen.getByTestId('paid-at')).toHaveTextContent(`PAID at ${UPDATED_AT}`);
        expect(mockedIdFormatter).toHaveBeenCalledWith(BASE_ID);
        expect(mockedIdFormatter).toHaveBeenCalledWith(BASE_OPERATION_ID);
    });

    it('formats both id and operationId independently', () => {
        const invoice = anInvoiceWithStatus(InvoiceStatus.PENDING);
        mockedIdFormatter.mockImplementation((value: string) => value.startsWith('INV') ? `INV_FMT(${value})` : `OP_FMT(${value})`);

        render(<InvoiceItemDetail invoice={invoice}/>);

        expect(screen.getByTestId('invoice-id')).toHaveTextContent(`INV_FMT(${BASE_ID})`);
        expect(screen.getByTestId('operation-id')).toHaveTextContent(`Operation: OP_FMT(${BASE_OPERATION_ID})`);
    });

    const BASE_ID = 'INV-001-ABC';
    const BASE_OPERATION_ID = 'OP-001-XYZ';
    const CREATED_AT = '2025-02-01T09:30:00';
    const UPDATED_AT = '2025-02-01T10:00:00';

    const anInvoiceWithStatus = (status: InvoiceStatus): Invoice => Builder<Invoice>()
        .id(BASE_ID)
        .operationId(BASE_OPERATION_ID)
        .amount({amount: 1500, currency: 'EUR'})
        .status(status)
        .createdAt(CREATED_AT)
        .updatedAt(UPDATED_AT)
        .build();
});

