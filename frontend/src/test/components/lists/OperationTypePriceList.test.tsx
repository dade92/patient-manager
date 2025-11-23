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

    it('renders multiple operation types with dividers', () => {
        const operationTypes = [
            buildOperationType('Cleaning', 'Regular dental cleaning', 50.00, 'EUR'),
            buildOperationType('Filling', 'Dental cavity filling', 120.00, 'USD'),
        ];

        render(<OperationTypePriceList operationTypes={operationTypes} loading={false} error={null}/>);

        expect(screen.getByTestId('operation-types-list')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-item-0')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-name-0')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-name-1')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-description-0')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-description-1')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-price-0')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-price-1')).toBeInTheDocument();
        expect(screen.getByTestId('operation-type-divider-0')).toBeInTheDocument();
        expect(screen.queryByTestId('operation-type-divider-1')).not.toBeInTheDocument();
    });

    const buildOperationType = (type: string, description: string, amount: number, currency: string): OperationType =>
        Builder<OperationType>()
            .type(type)
            .description(description)
            .estimatedBaseCost(
                Builder<Money>()
                    .amount(amount)
                    .currency(currency)
                    .build())
            .build();
});
