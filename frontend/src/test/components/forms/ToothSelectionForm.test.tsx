import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ToothSelectionForm} from '../../../components/forms/ToothSelectionForm';
import {ToothType} from '../../../types/ToothDetail';

jest.mock('../../../components/forms/TeethGrid', () => ({
    TeethGrid: jest.fn(({selectedTooth, onToothSelect}) => (
        <div data-testid="mocked-teeth-grid">
            <button
                data-testid="mock-tooth-button-11"
                onClick={() => onToothSelect(11, ToothType.PERMANENT)}
            >
                Tooth 11
            </button>
            <button
                data-testid="mock-tooth-button-12"
                onClick={() => onToothSelect(12, ToothType.PERMANENT)}
            >
                Tooth 12
            </button>
            <span data-testid="selected-tooth">{selectedTooth}</span>
        </div>
    ))
}));

describe('ToothSelectionForm', () => {
    const onSelectionChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all components properly', () => {
        render(<ToothSelectionForm onSelectionChange={onSelectionChange} estimatedCost={ESTIMATED_COST}/>);

        expect(screen.getByTestId('tooth-selection-form')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-details-title')).toBeInTheDocument();
        expect(screen.getByText('Tooth Details')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();
        expect(screen.getByTestId('selection-title-0')).toBeInTheDocument();
        expect(screen.getByText('Selection 1')).toBeInTheDocument();
        expect(screen.getByTestId('select-tooth-label-0')).toBeInTheDocument();
        expect(screen.getByText('Select tooth number:')).toBeInTheDocument();
        expect(screen.getByTestId('mocked-teeth-grid')).toBeInTheDocument();
        expect(screen.getByTestId('amount-input-0')).toBeInTheDocument();

        const removeButton = screen.getByTestId('remove-tooth-button-0');
        expect(removeButton).toBeInTheDocument();
        expect(removeButton).toBeDisabled();

        expect(screen.getByTestId('add-tooth-button')).toBeInTheDocument();
        expect(screen.getByText('Add Another Tooth')).toBeInTheDocument();
    });

    it('handles add tooth detail click correctly', () => {
        render(<ToothSelectionForm onSelectionChange={onSelectionChange} estimatedCost={ESTIMATED_COST}/>);

        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();
        expect(screen.queryByTestId('tooth-detail-paper-1')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('add-tooth-button'));

        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-detail-paper-1')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('add-tooth-button'));

        expect(screen.getByTestId('tooth-detail-paper-2')).toBeInTheDocument();
        expect(screen.getByText('Selection 3')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('remove-tooth-button-1'));

        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-detail-paper-1')).toBeInTheDocument();
        expect(screen.queryByTestId('tooth-detail-paper-2')).not.toBeInTheDocument();

        expect(onSelectionChange).toHaveBeenCalled();
    });

    it('handles amount change and tooth selection correctly', () => {
        render(<ToothSelectionForm onSelectionChange={onSelectionChange} estimatedCost={ESTIMATED_COST}/>);

        const amountInput = screen.getByTestId('amount-input-0').querySelector('input')!;
        fireEvent.change(amountInput, {target: {value: '200'}});

        expect(onSelectionChange).toHaveBeenCalledWith([{
            toothNumber: 0,
            amount: '200',
            toothType: ''
        }]);

        onSelectionChange.mockClear();

        fireEvent.click(screen.getByTestId('mock-tooth-button-11'));

        expect(onSelectionChange).toHaveBeenCalledWith([{
            toothNumber: 11,
            amount: '200',
            toothType: ToothType.PERMANENT
        }]);

        fireEvent.click(screen.getByTestId('add-tooth-button'));
        onSelectionChange.mockClear();
        const secondAmountInput = screen.getByTestId('amount-input-1').querySelector('input')!;
        fireEvent.change(secondAmountInput, {target: {value: '300'}});
        expect(onSelectionChange).toHaveBeenCalledWith([
            {
                toothNumber: 11,
                amount: '200',
                toothType: ToothType.PERMANENT
            },
            {
                toothNumber: 0,
                amount: '300',
                toothType: ''
            }
        ]);
    });

    it('initializes with estimated cost and updates amounts when estimated cost changes', () => {
        const {rerender} = render(
            <ToothSelectionForm onSelectionChange={onSelectionChange} estimatedCost={100}/>
        );

        const amountInput = screen.getByTestId('amount-input-0').querySelector('input')!;
        expect(amountInput).toHaveValue('100');

        fireEvent.click(screen.getByTestId('mock-tooth-button-11'));

        fireEvent.click(screen.getByTestId('add-tooth-button'));

        const secondToothGrid = screen.getAllByTestId('mocked-teeth-grid')[1];
        fireEvent.click(secondToothGrid.querySelector('[data-testid="mock-tooth-button-12"]')!);

        onSelectionChange.mockClear();

        rerender(
            <ToothSelectionForm onSelectionChange={onSelectionChange} estimatedCost={250}/>
        );

        const firstAmountInput = screen.getByTestId('amount-input-0').querySelector('input')!;
        const secondAmountInput = screen.getByTestId('amount-input-1').querySelector('input')!;

        expect(firstAmountInput).toHaveValue('250');
        expect(secondAmountInput).toHaveValue('250');

        expect(onSelectionChange).toHaveBeenCalledWith([
            {
                toothNumber: 11,
                amount: '250',
                toothType: ToothType.PERMANENT
            },
            {
                toothNumber: 12,
                amount: '250',
                toothType: ToothType.PERMANENT
            }
        ]);
    });

    const ESTIMATED_COST = 150;
});
