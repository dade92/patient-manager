import React from 'react';
import {render, screen} from '@testing-library/react';
import {InvoiceListItem} from '../../../components/lists/InvoiceListItem';
import {Invoice, InvoiceStatus} from '../../../types/invoice';
import {Builder} from 'builder-pattern';

const mockDetail = jest.fn();
const mockPayment = jest.fn();

jest.mock('../../../components/lists/InvoiceItemDetail', () => ({
    InvoiceItemDetail: (props: any) => {
        mockDetail(props);
        return <div data-testid="mock-invoice-detail"/>;
    }
}));

jest.mock('../../../components/lists/InvoiceItemPayment', () => ({
    InvoiceItemPayment: (props: any) => {
        mockPayment(props);
        return <div data-testid="mock-invoice-payment"/>;
    }
}));

describe('InvoiceListItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders invoice item and children', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);
        const onChange = jest.fn();

        render(
            <InvoiceListItem
                invoice={invoice}
                isLast={false}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChange}
            />
        );

        expect(screen.getByTestId('invoice-list-item')).toBeInTheDocument();
        expect(screen.getByTestId('mock-invoice-detail')).toBeInTheDocument();
        expect(screen.getByTestId('mock-invoice-payment')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-divider')).toBeInTheDocument();

        expect(mockDetail).toHaveBeenCalledWith(expect.objectContaining({invoice}));
        expect(mockPayment).toHaveBeenCalledWith(expect.objectContaining({
            invoice,
            isUpdatingOnPaid: false,
            isUpdatingOnCancel: false,
            onChangeInvoiceStatus: onChange
        }));
    });

    it('does not render divider when last', () => {
        const invoice = buildInvoice(InvoiceStatus.PAID);

        render(
            <InvoiceListItem
                invoice={invoice}
                isLast={true}
                isUpdatingOnPaid={true}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={jest.fn()}
            />
        );

        expect(screen.getByTestId('invoice-list-item')).toBeInTheDocument();
        expect(screen.queryByTestId('invoice-divider')).toBeNull();
    });

    it('passes updating flags to payment component', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);

        render(
            <InvoiceListItem
                invoice={invoice}
                isLast={false}
                isUpdatingOnPaid={true}
                isUpdatingOnCancel={true}
                onChangeInvoiceStatus={jest.fn()}
            />
        );

        expect(mockPayment).toHaveBeenCalledWith(expect.objectContaining({
            invoice,
            isUpdatingOnPaid: true,
            isUpdatingOnCancel: true
        }));
    });

    const INVOICE_ID = 'INV-001';
    const OPERATION_ID = 'OP-001';
    const CREATED_AT = '2025-02-01T09:30:00';
    const UPDATED_AT = '2025-02-01T10:00:00';
    const AMOUNT = 1500;
    const CURRENCY = 'EUR';

    const buildInvoice = (status: InvoiceStatus): Invoice => Builder<Invoice>()
        .id(INVOICE_ID)
        .operationId(OPERATION_ID)
        .amount({amount: AMOUNT, currency: CURRENCY})
        .status(status)
        .createdAt(CREATED_AT)
        .updatedAt(UPDATED_AT)
        .build();
});