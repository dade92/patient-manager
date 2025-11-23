import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ToothType} from '../../../types/ToothDetail';
import {TeethGrid} from '../../../components/forms/TeethGrid';
import {generateFdiDeciduousTeethNumbers, generateFdiTeethNumbers} from '../../../utils/teethUtils';

describe('TeethGrid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders properly', () => {
        render(<TeethGrid selectedTooth={SELECTED_TOOTH} onToothSelect={onToothSelect}/>);

        expect(screen.getByTestId('teeth-grid-container')).toBeInTheDocument();

        expect(screen.getByTestId('teeth-type-toggle-group')).toBeInTheDocument();
        expect(screen.getByTestId('permanent-teeth-button')).toBeInTheDocument();
        expect(screen.getByTestId('deciduous-teeth-button')).toBeInTheDocument();
        expect(screen.getByTestId('teeth-grid')).toBeInTheDocument();
        expect(screen.getByTestId('permanent-teeth-button')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByTestId('deciduous-teeth-button')).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByTestId('teeth-row-0')).toBeInTheDocument();
        expect(screen.getByTestId('teeth-row-1')).toBeInTheDocument();

        const selectedToothButton = screen.getByTestId(`tooth-button-${SELECTED_TOOTH}`);
        expect(selectedToothButton).toHaveClass('MuiButton-contained');
        const otherTooth = PERMANENT_TEETH[0][1];
        const otherToothButton = screen.getByTestId(`tooth-button-${otherTooth}`);
        expect(otherToothButton).toHaveClass('MuiButton-outlined');
        expect(otherToothButton).not.toHaveClass('MuiButton-contained');
    });

    it('changes teeth types from permanent to deciduous and back', () => {
        render(<TeethGrid selectedTooth={SELECTED_TOOTH} onToothSelect={onToothSelect}/>);

        expect(screen.getByTestId('permanent-teeth-button')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByTestId('deciduous-teeth-button')).toHaveAttribute('aria-pressed', 'false');

        const firstPermanentTooth = PERMANENT_TEETH[0][0];
        const secondPermanentTooth = PERMANENT_TEETH[0][1];
        expect(screen.getByTestId(`tooth-button-${firstPermanentTooth}`)).toBeInTheDocument();
        expect(screen.getByTestId(`tooth-button-${secondPermanentTooth}`)).toBeInTheDocument();

        const firstDeciduousTooth = DECIDUOUS_TEETH[0][0];
        const secondDeciduousTooth = DECIDUOUS_TEETH[0][1];
        expect(screen.queryByTestId(`tooth-button-${firstDeciduousTooth}`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`tooth-button-${secondDeciduousTooth}`)).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('deciduous-teeth-button'));

        expect(screen.getByTestId(`tooth-button-${firstDeciduousTooth}`)).toBeInTheDocument();
        expect(screen.getByTestId(`tooth-button-${secondDeciduousTooth}`)).toBeInTheDocument();
        expect(screen.queryByTestId(`tooth-button-${firstPermanentTooth}`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`tooth-button-${secondPermanentTooth}`)).not.toBeInTheDocument();
    });

    it('calls onToothSelect callback with proper params when tooth is selected', () => {
        render(<TeethGrid selectedTooth={SELECTED_TOOTH} onToothSelect={onToothSelect}/>);

        const firstPermanentTooth = PERMANENT_TEETH[0][0];
        const toothButton = screen.getByTestId(`tooth-button-${firstPermanentTooth}`);
        fireEvent.click(toothButton);

        expect(onToothSelect).toHaveBeenCalledWith(firstPermanentTooth, ToothType.PERMANENT);
        expect(onToothSelect).toHaveBeenCalledTimes(1);

        onToothSelect.mockClear();

        const secondPermanentTooth = PERMANENT_TEETH[0][1];
        const secondToothButton = screen.getByTestId(`tooth-button-${secondPermanentTooth}`);
        fireEvent.click(secondToothButton);

        expect(onToothSelect).toHaveBeenCalledWith(secondPermanentTooth, ToothType.PERMANENT);
        expect(onToothSelect).toHaveBeenCalledTimes(1);
    });

    const onToothSelect = jest.fn();
    const SELECTED_TOOTH = 11;
    const PERMANENT_TEETH = generateFdiTeethNumbers();
    const DECIDUOUS_TEETH = generateFdiDeciduousTeethNumbers();
});
