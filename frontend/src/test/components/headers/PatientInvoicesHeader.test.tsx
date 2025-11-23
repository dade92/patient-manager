import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {PatientInvoicesHeader} from '../../../components/headers/PatientInvoicesHeader';

describe('PatientInvoicesHeader', () => {
    const onToggleExpanded = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with expanded state and no pending invoices', () => {
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

    const PENDING_COUNT = 3;
});