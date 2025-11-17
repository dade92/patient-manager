import React from 'react';
import {render, screen} from '@testing-library/react';
import {OperationTypePriceList} from '../../../components/lists/OperationTypePriceList';
import {OperationType} from '../../../types/OperationType';
import {Money} from '../../../types/Money';
import {Builder} from 'builder-pattern';

describe('OperationTypePriceList', () => {
    it('renders loading state with skeletons', () => {
        render(<OperationTypePriceList operationTypes={[]} loading={true} error={null}/>);

        expect(screen.getByTestId('operation-types-loading-list')).toBeInTheDocument();
        expect(screen.getAllByTestId('skeleton-primary')).toHaveLength(2);
        expect(screen.getAllByTestId('skeleton-secondary')).toHaveLength(2);
        expect(screen.getAllByTestId('skeleton-price')).toHaveLength(2);
    });

    it('renders error state', () => {
        const errorMessage = 'Failed to load operation types';

        render(<OperationTypePriceList operationTypes={[]} loading={false} error={errorMessage}/>);

        expect(screen.getByTestId('operation-types-error')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders empty state when no operation types', () => {
        render(<OperationTypePriceList operationTypes={[]} loading={false} error={null}/>);

        expect(screen.getByTestId('operation-types-empty')).toBeInTheDocument();
        expect(screen.getByText('No operation types available')).toBeInTheDocument();
    });

    it('renders single operation type correctly', () => {
        const operationType = buildOperationType('Cleaning', 'Regular dental cleaning', 50.00, 'EUR');

        render(<OperationTypePriceList operationTypes={[operationType]} loading={false} error={null}/>);

        expect(screen.getByText('Cleaning')).toBeInTheDocument();
        expect(screen.getByText('Regular dental cleaning')).toBeInTheDocument();
        expect(screen.getByText('EUR 50.00')).toBeInTheDocument();
        expect(screen.queryByRole('separator')).not.toBeInTheDocument(); // No divider for single item
    });

    it('renders multiple operation types with dividers', () => {
        const operationTypes = [
            buildOperationType('Cleaning', 'Regular dental cleaning', 50.00, 'EUR'),
            buildOperationType('Filling', 'Dental cavity filling', 120.00, 'USD'),
            buildOperationType('Extraction', 'Tooth extraction', 200.00, 'EUR')
        ];

        render(<OperationTypePriceList operationTypes={operationTypes} loading={false} error={null}/>);

        // Check all operation types are rendered
        expect(screen.getByText('Cleaning')).toBeInTheDocument();
        expect(screen.getByText('Filling')).toBeInTheDocument();
        expect(screen.getByText('Extraction')).toBeInTheDocument();

        // Check descriptions
        expect(screen.getByText('Regular dental cleaning')).toBeInTheDocument();
        expect(screen.getByText('Dental cavity filling')).toBeInTheDocument();
        expect(screen.getByText('Tooth extraction')).toBeInTheDocument();

        // Check prices with currencies
        expect(screen.getByText('EUR 50.00')).toBeInTheDocument();
        expect(screen.getByText('USD 120.00')).toBeInTheDocument();
        expect(screen.getByText('EUR 200.00')).toBeInTheDocument();

        // Check dividers (should be 2 dividers for 3 items)
        const dividers = screen.getAllByRole('separator');
        expect(dividers).toHaveLength(2);
    });

    it('renders operation types with different currencies correctly', () => {
        const operationTypes = [
            buildOperationType('Service A', 'Description A', 100.50, 'USD'),
            buildOperationType('Service B', 'Description B', 75.25, 'GBP')
        ];

        render(<OperationTypePriceList operationTypes={operationTypes} loading={false} error={null}/>);

        expect(screen.getByText('USD 100.50')).toBeInTheDocument();
        expect(screen.getByText('GBP 75.25')).toBeInTheDocument();
    });

    it('formats decimal prices correctly', () => {
        const operationType = buildOperationType('Test Service', 'Test description', 99.9, 'EUR');

        render(<OperationTypePriceList operationTypes={[operationType]} loading={false} error={null}/>);

        expect(screen.getByText('EUR 99.90')).toBeInTheDocument();
    });

    it('handles zero price correctly', () => {
        const operationType = buildOperationType('Free Service', 'Free consultation', 0, 'EUR');

        render(<OperationTypePriceList operationTypes={[operationType]} loading={false} error={null}/>);

        expect(screen.getByText('EUR 0.00')).toBeInTheDocument();
    });

    it('renders operation type with long description', () => {
        const longDescription = 'This is a very long description that should be displayed properly in the secondary text area';
        const operationType = buildOperationType('Complex Service', longDescription, 300.00, 'EUR');

        render(<OperationTypePriceList operationTypes={[operationType]} loading={false} error={null}/>);

        expect(screen.getByText('Complex Service')).toBeInTheDocument();
        expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    const buildOperationType = (type: string, description: string, amount: number, currency: string): OperationType => {
        const money = Builder<Money>()
            .amount(amount)
            .currency(currency)
            .build();
        return Builder<OperationType>()
            .type(type)
            .description(description)
            .estimatedBaseCost(money)
            .build();
    };
});
