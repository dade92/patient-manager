import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ToothSelectionForm} from '../../../components/forms/ToothSelectionForm';
import {ToothType} from '../../../types/ToothDetail';

jest.mock('../../../components/forms/TeethGrid', () => ({
    TeethGrid: jest.fn(({ selectedTooth, onToothSelect }) => (
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
    const mockOnSelectionChange = jest.fn();
    const estimatedCost = 150;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all components properly', () => {
        render(<ToothSelectionForm onSelectionChange={mockOnSelectionChange} estimatedCost={estimatedCost} />);

        // Check main container
        expect(screen.getByTestId('tooth-selection-form')).toBeInTheDocument();

        // Check title
        expect(screen.getByTestId('tooth-details-title')).toBeInTheDocument();
        expect(screen.getByText('Tooth Details')).toBeInTheDocument();

        // Check initial tooth detail paper
        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();

        // Check selection title
        expect(screen.getByTestId('selection-title-0')).toBeInTheDocument();
        expect(screen.getByText('Selection 1')).toBeInTheDocument();

        // Check tooth selection label
        expect(screen.getByTestId('select-tooth-label-0')).toBeInTheDocument();
        expect(screen.getByText('Select tooth number:')).toBeInTheDocument();

        // Check TeethGrid is rendered
        expect(screen.getByTestId('mocked-teeth-grid')).toBeInTheDocument();

        // Check amount input field
        expect(screen.getByTestId('amount-input-0')).toBeInTheDocument();

        // Check remove tooth button (should be disabled initially as there's only one)
        const removeButton = screen.getByTestId('remove-tooth-button-0');
        expect(removeButton).toBeInTheDocument();
        expect(removeButton).toBeDisabled();

        // Check add tooth button
        expect(screen.getByTestId('add-tooth-button')).toBeInTheDocument();
        expect(screen.getByText('Add Another Tooth')).toBeInTheDocument();
    });

    it('handles add tooth detail click correctly', () => {
        render(<ToothSelectionForm onSelectionChange={mockOnSelectionChange} estimatedCost={estimatedCost} />);

        // Initially should have one tooth detail
        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();
        expect(screen.queryByTestId('tooth-detail-paper-1')).not.toBeInTheDocument();

        // Remove button should be disabled
        expect(screen.getByTestId('remove-tooth-button-0')).toBeDisabled();

        // Click add tooth button
        fireEvent.click(screen.getByTestId('add-tooth-button'));

        // Should now have two tooth details
        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-detail-paper-1')).toBeInTheDocument();

        // Check second selection has correct title
        expect(screen.getByTestId('selection-title-1')).toBeInTheDocument();
        expect(screen.getByText('Selection 2')).toBeInTheDocument();

        // Check second selection components
        expect(screen.getByTestId('select-tooth-label-1')).toBeInTheDocument();
        expect(screen.getByTestId('amount-input-1')).toBeInTheDocument();
        expect(screen.getByTestId('remove-tooth-button-1')).toBeInTheDocument();

        // Remove buttons should now be enabled
        expect(screen.getByTestId('remove-tooth-button-0')).not.toBeDisabled();
        expect(screen.getByTestId('remove-tooth-button-1')).not.toBeDisabled();

        // Add third tooth detail
        fireEvent.click(screen.getByTestId('add-tooth-button'));

        // Should now have three tooth details
        expect(screen.getByTestId('tooth-detail-paper-2')).toBeInTheDocument();
        expect(screen.getByText('Selection 3')).toBeInTheDocument();

        // Remove a tooth detail
        fireEvent.click(screen.getByTestId('remove-tooth-button-1'));

        // Should now have two tooth details again
        expect(screen.getByTestId('tooth-detail-paper-0')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-detail-paper-1')).toBeInTheDocument();
        expect(screen.queryByTestId('tooth-detail-paper-2')).not.toBeInTheDocument();

        // Verify onSelectionChange was called
        expect(mockOnSelectionChange).toHaveBeenCalled();
    });

    it('handles amount change and tooth selection correctly', () => {
        render(<ToothSelectionForm onSelectionChange={mockOnSelectionChange} estimatedCost={estimatedCost} />);

        // Test amount change
        const amountInput = screen.getByTestId('amount-input-0').querySelector('input')!;
        fireEvent.change(amountInput, { target: { value: '200' } });

        // Verify onSelectionChange was called with updated amount
        expect(mockOnSelectionChange).toHaveBeenCalledWith([{
            toothNumber: 0,
            amount: '200',
            toothType: ''
        }]);

        // Clear mock for tooth selection test
        mockOnSelectionChange.mockClear();

        // Test tooth selection
        fireEvent.click(screen.getByTestId('mock-tooth-button-11'));

        // Verify onSelectionChange was called with selected tooth
        expect(mockOnSelectionChange).toHaveBeenCalledWith([{
            toothNumber: 11,
            amount: '200',
            toothType: ToothType.PERMANENT
        }]);

        // Clear mock and test different tooth selection
        mockOnSelectionChange.mockClear();

        fireEvent.click(screen.getByTestId('mock-tooth-button-12'));

        // Verify onSelectionChange was called with new selected tooth
        expect(mockOnSelectionChange).toHaveBeenCalledWith([{
            toothNumber: 12,
            amount: '200',
            toothType: ToothType.PERMANENT
        }]);

        // Test with multiple tooth details
        fireEvent.click(screen.getByTestId('add-tooth-button'));

        // Clear mock for second tooth detail test
        mockOnSelectionChange.mockClear();

        // Change amount for second tooth detail
        const secondAmountInput = screen.getByTestId('amount-input-1').querySelector('input')!;
        fireEvent.change(secondAmountInput, { target: { value: '300' } });

        // Verify onSelectionChange was called with both tooth details
        expect(mockOnSelectionChange).toHaveBeenCalledWith([
            {
                toothNumber: 12,
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
        const { rerender } = render(
            <ToothSelectionForm onSelectionChange={mockOnSelectionChange} estimatedCost={100} />
        );

        // Check initial amount is set to estimated cost
        const amountInput = screen.getByTestId('amount-input-0').querySelector('input')!;
        expect(amountInput).toHaveValue('100');

        // Add another tooth detail
        fireEvent.click(screen.getByTestId('add-tooth-button'));

        // Clear mock for rerender test
        mockOnSelectionChange.mockClear();

        // Change estimated cost
        rerender(
            <ToothSelectionForm onSelectionChange={mockOnSelectionChange} estimatedCost={250} />
        );

        // Verify both amounts are updated to new estimated cost
        const firstAmountInput = screen.getByTestId('amount-input-0').querySelector('input')!;
        const secondAmountInput = screen.getByTestId('amount-input-1').querySelector('input')!;

        expect(firstAmountInput).toHaveValue('250');
        expect(secondAmountInput).toHaveValue('250');

        // Verify onSelectionChange was called with updated amounts
        expect(mockOnSelectionChange).toHaveBeenCalledWith([
            {
                toothNumber: 0,
                amount: '250',
                toothType: ''
            },
            {
                toothNumber: 0,
                amount: '250',
                toothType: ''
            }
        ]);
    });
});
