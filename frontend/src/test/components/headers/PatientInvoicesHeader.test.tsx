import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {PatientInvoicesHeader} from '../../../components/headers/PatientInvoicesHeader';

const PENDING_COUNT = 3;

describe('PatientInvoicesHeader', () => {
    it('renders with expanded state and no pending invoices', () => {
        const onToggleExpanded = jest.fn();

        render(
            <PatientInvoicesHeader
                expanded={true}
                pendingInvoicesCount={0}
                onToggleExpanded={onToggleExpanded}
            />
        );

        expect(screen.getByTestId('patient-invoices-header')).toBeInTheDocument();
        expect(screen.getByTestId('invoices-title')).toHaveTextContent('Invoices');
        expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
        expect(screen.getByTestId('collapse-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('expand-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('pending-invoices-badge')).not.toBeInTheDocument();
    });

    it('renders with collapsed state and no pending invoices', () => {
        const onToggleExpanded = jest.fn();

        render(
            <PatientInvoicesHeader
                expanded={false}
                pendingInvoicesCount={0}
                onToggleExpanded={onToggleExpanded}
            />
        );

        expect(screen.getByTestId('patient-invoices-header')).toBeInTheDocument();
        expect(screen.getByTestId('invoices-title')).toHaveTextContent('Invoices');
        expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
        expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('collapse-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('pending-invoices-badge')).not.toBeInTheDocument();
    });

    it('renders with pending invoices badge', () => {
        const onToggleExpanded = jest.fn();

        render(
            <PatientInvoicesHeader
                expanded={false}
                pendingInvoicesCount={PENDING_COUNT}
                onToggleExpanded={onToggleExpanded}
            />
        );

        expect(screen.getByTestId('patient-invoices-header')).toBeInTheDocument();
        expect(screen.getByTestId('invoices-title')).toHaveTextContent('Invoices');
        expect(screen.getByTestId('pending-invoices-badge')).toBeInTheDocument();
        expect(screen.getByTestId('pending-invoices-badge')).toHaveTextContent(PENDING_COUNT.toString());
    });

    it('calls onToggleExpanded when header is clicked', () => {
        const onToggleExpanded = jest.fn();

        render(
            <PatientInvoicesHeader
                expanded={false}
                pendingInvoicesCount={0}
                onToggleExpanded={onToggleExpanded}
            />
        );

        fireEvent.click(screen.getByTestId('patient-invoices-header'));

        expect(onToggleExpanded).toHaveBeenCalledTimes(1);
    });

    it('calls onToggleExpanded when toggle button is clicked', () => {
        const onToggleExpanded = jest.fn();

        render(
            <PatientInvoicesHeader
                expanded={false}
                pendingInvoicesCount={0}
                onToggleExpanded={onToggleExpanded}
            />
        );

        fireEvent.click(screen.getByTestId('toggle-button'));

        expect(onToggleExpanded).toHaveBeenCalledTimes(1);
    });

    it('calls onToggleExpanded multiple times on repeated clicks', () => {
        const onToggleExpanded = jest.fn();

        render(
            <PatientInvoicesHeader
                expanded={false}
                pendingInvoicesCount={PENDING_COUNT}
                onToggleExpanded={onToggleExpanded}
            />
        );

        const header = screen.getByTestId('patient-invoices-header');
        fireEvent.click(header);
        fireEvent.click(header);
        fireEvent.click(header);

        expect(onToggleExpanded).toHaveBeenCalledTimes(3);
    });
});

