import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {InvoiceItemPayment} from '../../../components/lists/InvoiceItemPayment';
import {Invoice, InvoiceStatus} from '../../../types/invoice';
import {Money} from '../../../types/Money';
import {Builder} from 'builder-pattern';

jest.mock('../../../utils/currencyUtils', () => ({
    formatAmount: jest.fn((amount: number, currency: string) => `${currency} ${amount.toFixed(2)}`)
}));

jest.mock('../../../utils/invoiceUtils', () => ({
    getInvoiceStatusColor: jest.fn((status: InvoiceStatus) => {
        switch (status) {
            case InvoiceStatus.PENDING:
                return 'warning';
            case InvoiceStatus.PAID:
                return 'success';
            case InvoiceStatus.CANCELLED:
                return 'error';
            default:
                return 'default';
        }
    })
}));

describe('InvoiceItemPayment', () => {
    const onChangeInvoiceStatus = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders invoice amount correctly', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        expect(screen.getByTestId('invoice-item-payment')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-amount')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-status-chip')).toBeInTheDocument();
    });

    it('shows payment buttons when invoice status is PENDING', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        expect(screen.getByTestId('invoice-payment-buttons')).toBeInTheDocument();
        expect(screen.getByTestId('mark-as-paid-button')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-invoice-button')).toBeInTheDocument();
    });

    it('does not show payment buttons when invoice status is PAID', () => {
        const invoice = buildInvoice(InvoiceStatus.PAID);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        expect(screen.queryByTestId('invoice-payment-buttons')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mark-as-paid-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cancel-invoice-button')).not.toBeInTheDocument();
    });

    it('does not show payment buttons when invoice status is CANCELLED', () => {
        const invoice = buildInvoice(InvoiceStatus.CANCELLED);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        expect(screen.queryByTestId('invoice-payment-buttons')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mark-as-paid-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cancel-invoice-button')).not.toBeInTheDocument();
    });

    it('calls onChangeInvoiceStatus with PAID when Mark as Paid button is clicked', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        fireEvent.click(screen.getByTestId('mark-as-paid-button'));

        expect(onChangeInvoiceStatus).toHaveBeenCalledTimes(1);
        expect(onChangeInvoiceStatus).toHaveBeenCalledWith(ID, InvoiceStatus.PAID);
    });

    it('calls onChangeInvoiceStatus with CANCELLED when Cancel button is clicked', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        fireEvent.click(screen.getByTestId('cancel-invoice-button'));

        expect(onChangeInvoiceStatus).toHaveBeenCalledTimes(1);
        expect(onChangeInvoiceStatus).toHaveBeenCalledWith(ID, InvoiceStatus.CANCELLED);
    });

    it('shows loading state for Mark as Paid button when isUpdatingOnPaid is true', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={true}
                isUpdatingOnCancel={false}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        expect(screen.getByTestId('mark-as-paid-button')).toBeDisabled();
        expect(screen.getByTestId('cancel-invoice-button')).toBeDisabled();
    });

    it('shows loading state for Cancel button when isUpdatingOnCancel is true', () => {
        const invoice = buildInvoice(InvoiceStatus.PENDING);

        render(
            <InvoiceItemPayment
                invoice={invoice}
                isUpdatingOnPaid={false}
                isUpdatingOnCancel={true}
                onChangeInvoiceStatus={onChangeInvoiceStatus}
            />
        );

        expect(screen.getByTestId('mark-as-paid-button')).toBeDisabled();
        expect(screen.getByTestId('cancel-invoice-button')).toBeDisabled();
    });

    const ID = '123'
    const buildInvoice = (status: InvoiceStatus): Invoice =>
        Builder<Invoice>()
            .id(ID)
            .operationId('op-123')
            .amount(Builder<Money>().amount(150.50).currency('EUR').build())
            .status(status)
            .createdAt('2025-02-01T10:00:00Z')
            .updatedAt('2025-02-01T10:00:00Z')
            .build();
});
