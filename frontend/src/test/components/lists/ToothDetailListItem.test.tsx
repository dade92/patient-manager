import React from 'react';
import {render, screen} from '@testing-library/react';
import {ToothDetailListItem} from '../../../components/lists/ToothDetailListItem';
import {ToothDetail, ToothType} from '../../../types/ToothDetail';
import {formatAmount} from '../../../utils/currencyUtils';
import {Builder} from 'builder-pattern';

jest.mock('../../../utils/currencyUtils', () => ({
    formatAmount: jest.fn()
}));

const mockedFormatAmount = formatAmount as jest.Mock;

const TOOTH_NUMBER = 11;
const AMOUNT = 150;
const CURRENCY = 'EUR';
const FORMATTED_AMOUNT = '150.00 EUR';
const INDEX = 0;

const PERMANENT_DETAIL = Builder<ToothDetail>()
    .toothNumber(TOOTH_NUMBER)
    .estimatedCost({amount: AMOUNT, currency: CURRENCY})
    .toothType(ToothType.PERMANENT)
    .build();

const DECIDUOUS_DETAIL = Builder<ToothDetail>()
    .toothNumber(21)
    .estimatedCost({amount: 100, currency: CURRENCY})
    .toothType(ToothType.DECIDUOUS)
    .build();

describe('ToothDetailListItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders permanent tooth correctly', () => {
        mockedFormatAmount.mockReturnValue(FORMATTED_AMOUNT);

        render(
            <ToothDetailListItem
                detail={PERMANENT_DETAIL}
                index={INDEX}
                isLast={false}
            />
        );

        expect(screen.getByTestId(`tooth-detail-item-${INDEX}`)).toBeInTheDocument();
        expect(screen.getByTestId('tooth-number')).toHaveTextContent(TOOTH_NUMBER.toString());
        expect(screen.getByTestId('tooth-type-chip')).toHaveTextContent('Permanent');
        expect(screen.getByTestId('tooth-cost')).toHaveTextContent(FORMATTED_AMOUNT);
        expect(mockedFormatAmount).toHaveBeenCalledWith(AMOUNT, CURRENCY);
    });

    it('renders deciduous tooth correctly', () => {
        mockedFormatAmount.mockReturnValue('100.00 EUR');

        render(
            <ToothDetailListItem
                detail={DECIDUOUS_DETAIL}
                index={1}
                isLast={true}
            />
        );

        expect(screen.getByTestId('tooth-detail-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-number')).toHaveTextContent('21');
        expect(screen.getByTestId('tooth-type-chip')).toHaveTextContent('Baby');
        expect(screen.getByTestId('tooth-cost')).toHaveTextContent('100.00 EUR');
        expect(mockedFormatAmount).toHaveBeenCalledWith(100, CURRENCY);
    });

    it('applies divider when not last item', () => {
        mockedFormatAmount.mockReturnValue(FORMATTED_AMOUNT);

        render(
            <ToothDetailListItem
                detail={PERMANENT_DETAIL}
                index={INDEX}
                isLast={false}
            />
        );

        const listItem = screen.getByTestId(`tooth-detail-item-${INDEX}`);
        expect(listItem).toHaveClass('MuiListItem-divider');
    });

    it('does not apply divider when last item', () => {
        mockedFormatAmount.mockReturnValue(FORMATTED_AMOUNT);

        render(
            <ToothDetailListItem
                detail={PERMANENT_DETAIL}
                index={INDEX}
                isLast={true}
            />
        );

        const listItem = screen.getByTestId(`tooth-detail-item-${INDEX}`);
        expect(listItem).not.toHaveClass('MuiListItem-divider');
    });
});

