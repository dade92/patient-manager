import React from 'react';
import {render, screen} from '@testing-library/react';
import {InvoiceItemDetail} from '../../../components/lists/InvoiceItemDetail';
import {Invoice, InvoiceStatus} from '../../../types/invoice';
import {Builder} from 'builder-pattern';
import {idFormatter} from '../../../utils/idFormatter';

jest.mock('../../../utils/idFormatter', () => ({
    idFormatter: jest.fn()
}));
const formatter = idFormatter as jest.Mock;

describe('InvoiceItemDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        formatter.mockImplementation((value: string) => `FMT(${value})`);
    });

    it('renders pending invoice without paid-at line', () => {
        const invoice = anInvoiceWithStatus(InvoiceStatus.PENDING);

        renderInvoiceItemDetail(invoice);

        expect(screen.getByTestId('invoice-item-detail')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-id')).toHaveTextContent(`FMT(${BASE_ID})`);
        expect(screen.getByTestId('operation-id')).toHaveTextContent(`Operation: FMT(${BASE_OPERATION_ID})`);
        expect(screen.getByTestId('created-at')).toHaveTextContent(`Created at: ${CREATED_AT}`);
        expect(screen.queryByTestId('paid-at')).toBeNull();
        expect(formatter).toHaveBeenCalledWith(BASE_ID);
        expect(formatter).toHaveBeenCalledWith(BASE_OPERATION_ID);
    });

    it('renders paid invoice with paid-at line', () => {
        const invoice = anInvoiceWithStatus(InvoiceStatus.PAID);

        renderInvoiceItemDetail(invoice);

        expect(screen.getByTestId('invoice-item-detail')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-id')).toHaveTextContent(`FMT(${BASE_ID})`);
        expect(screen.getByTestId('operation-id')).toHaveTextContent(`Operation: FMT(${BASE_OPERATION_ID})`);
        expect(screen.getByTestId('created-at')).toHaveTextContent(`Created at: ${CREATED_AT}`);
        expect(screen.getByTestId('paid-at')).toHaveTextContent(`PAID at ${UPDATED_AT}`);
        expect(formatter).toHaveBeenCalledWith(BASE_ID);
        expect(formatter).toHaveBeenCalledWith(BASE_OPERATION_ID);
    });

    it('formats both id and operationId independently', () => {
        const invoice = anInvoiceWithStatus(InvoiceStatus.PENDING);
        formatter.mockImplementation((value: string) => value.startsWith('INV') ? `INV_FMT(${value})` : `OP_FMT(${value})`);

        renderInvoiceItemDetail(invoice);

        expect(screen.getByTestId('invoice-id')).toHaveTextContent(`INV_FMT(${BASE_ID})`);
        expect(screen.getByTestId('operation-id')).toHaveTextContent(`Operation: OP_FMT(${BASE_OPERATION_ID})`);
    });

    const BASE_ID = 'INV-001-ABC';
    const BASE_OPERATION_ID = 'OP-001-XYZ';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    const anInvoiceWithStatus = (status: InvoiceStatus): Invoice =>
        Builder<Invoice>()
            .id(BASE_ID)
            .operationId(BASE_OPERATION_ID)
            .amount({amount: 1500, currency: 'EUR'})
            .status(status)
            .createdAt(CREATED_AT)
            .updatedAt(UPDATED_AT)
            .build();
    const renderInvoiceItemDetail = (invoice: Invoice) =>
        render(<InvoiceItemDetail invoice={invoice}/>)
});

