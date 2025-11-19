import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ToothType} from '../../../types/ToothDetail';
import {TeethGrid} from '../../../components/forms/TeethGrid';
import {generateFdiTeethNumbers, generateFdiDeciduousTeethNumbers} from '../../../utils/teethUtils';

describe('TeethGrid', () => {
    const onToothSelect = jest.fn();
    const selectedTooth = 11;

    const permanentTeeth = generateFdiTeethNumbers();
    const deciduousTeeth = generateFdiDeciduousTeethNumbers();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all necessary components in the document', () => {
        render(<TeethGrid selectedTooth={selectedTooth} onToothSelect={onToothSelect}/>);

        expect(screen.getByTestId('teeth-grid-container')).toBeInTheDocument();

        expect(screen.getByTestId('teeth-type-toggle-group')).toBeInTheDocument();
        expect(screen.getByTestId('permanent-teeth-button')).toBeInTheDocument();
        expect(screen.getByTestId('deciduous-teeth-button')).toBeInTheDocument();
        expect(screen.getByTestId('teeth-grid')).toBeInTheDocument();
        expect(screen.getByTestId('permanent-teeth-button')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByTestId('deciduous-teeth-button')).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByTestId('teeth-row-0')).toBeInTheDocument();
        expect(screen.getByTestId('teeth-row-1')).toBeInTheDocument();

        const selectedToothButton = screen.getByTestId(`tooth-button-${selectedTooth}`);
        expect(selectedToothButton).toHaveClass('MuiButton-contained');
        const otherTooth = permanentTeeth[0][1];
        const otherToothButton = screen.getByTestId(`tooth-button-${otherTooth}`);
        expect(otherToothButton).toHaveClass('MuiButton-outlined');
        expect(otherToothButton).not.toHaveClass('MuiButton-contained');
    });

    it('changes teeth types from permanent to deciduous and back', () => {
        render(<TeethGrid selectedTooth={selectedTooth} onToothSelect={onToothSelect}/>);

        expect(screen.getByTestId('permanent-teeth-button')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByTestId('deciduous-teeth-button')).toHaveAttribute('aria-pressed', 'false');

        const firstPermanentTooth = permanentTeeth[0][0];
        const secondPermanentTooth = permanentTeeth[0][1];
        expect(screen.getByTestId(`tooth-button-${firstPermanentTooth}`)).toBeInTheDocument();
        expect(screen.getByTestId(`tooth-button-${secondPermanentTooth}`)).toBeInTheDocument();

        const firstDeciduousTooth = deciduousTeeth[0][0];
        const secondDeciduousTooth = deciduousTeeth[0][1];
        expect(screen.queryByTestId(`tooth-button-${firstDeciduousTooth}`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`tooth-button-${secondDeciduousTooth}`)).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('deciduous-teeth-button'));

        expect(screen.getByTestId(`tooth-button-${firstDeciduousTooth}`)).toBeInTheDocument();
        expect(screen.getByTestId(`tooth-button-${secondDeciduousTooth}`)).toBeInTheDocument();
        expect(screen.queryByTestId(`tooth-button-${firstPermanentTooth}`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`tooth-button-${secondPermanentTooth}`)).not.toBeInTheDocument();
    });

    it('calls onToothSelect callback with proper params when tooth is selected', () => {
        render(<TeethGrid selectedTooth={selectedTooth} onToothSelect={onToothSelect}/>);

        const firstPermanentTooth = permanentTeeth[0][0];
        const toothButton = screen.getByTestId(`tooth-button-${firstPermanentTooth}`);
        fireEvent.click(toothButton);

        expect(onToothSelect).toHaveBeenCalledWith(firstPermanentTooth, ToothType.PERMANENT);
        expect(onToothSelect).toHaveBeenCalledTimes(1);

        onToothSelect.mockClear();

        const secondPermanentTooth = permanentTeeth[0][1];
        const secondToothButton = screen.getByTestId(`tooth-button-${secondPermanentTooth}`);
        fireEvent.click(secondToothButton);

        expect(onToothSelect).toHaveBeenCalledWith(secondPermanentTooth, ToothType.PERMANENT);
        expect(onToothSelect).toHaveBeenCalledTimes(1);
    });
});
