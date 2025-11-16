import React from 'react';
import {render, screen} from '@testing-library/react';
import {ToothDetails} from '../../../components/lists/ToothDetails';
import {ToothDetail, ToothType} from '../../../types/ToothDetail';
import {formatAmount} from '../../../utils/currencyUtils';
import {Builder} from 'builder-pattern';

jest.mock('../../../utils/currencyUtils', () => ({
    formatAmount: jest.fn()
}));

const mockedFormatAmount = formatAmount as jest.Mock;

const mockListItem = jest.fn();
jest.mock('../../../components/lists/ToothDetailListItem', () => ({
    ToothDetailListItem: (props: any) => {
        mockListItem(props);
        return <div data-testid={`tooth-detail-item-${props.index}`}/>;
    }
}));

describe('ToothDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state', () => {
        render(<ToothDetails details={[]}/>);
        expect(screen.getByTestId('tooth-details-empty')).toBeInTheDocument();
        expect(screen.queryByTestId('tooth-details')).toBeNull();
        expect(mockListItem).not.toHaveBeenCalled();
    });

    it('renders teeth list', () => {
        mockedFormatAmount.mockReturnValue(FORMATTED_TOTAL);

        render(<ToothDetails details={DETAILS}/>);

        expect(screen.getByTestId('tooth-details')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-detail-item-0')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-detail-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('tooth-details-total')).toHaveTextContent(FORMATTED_TOTAL);
        expect(mockedFormatAmount).toHaveBeenCalledWith(TOTAL_AMOUNT, CURRENCY);
        expect(mockListItem).toHaveBeenNthCalledWith(1, expect.objectContaining({detail: DETAIL_1, index: 0}));
        expect(mockListItem).toHaveBeenNthCalledWith(2, expect.objectContaining({detail: DETAIL_2, index: 1}));
    });

    const TOOTH_NUMBER_1 = 11;
    const TOOTH_NUMBER_2 = 12;
    const AMOUNT_1 = 100;
    const AMOUNT_2 = 150;
    const CURRENCY = 'EUR';
    const TOTAL_AMOUNT = 250;
    const FORMATTED_TOTAL = '250.00 EUR';
    const DETAIL_1 = Builder<ToothDetail>()
        .toothNumber(TOOTH_NUMBER_1)
        .estimatedCost({amount: AMOUNT_1, currency: CURRENCY})
        .toothType(ToothType.PERMANENT)
        .build();
    const DETAIL_2 = Builder<ToothDetail>()
        .toothNumber(TOOTH_NUMBER_2)
        .estimatedCost({amount: AMOUNT_2, currency: CURRENCY})
        .toothType(ToothType.PERMANENT)
        .build();
    const DETAILS: ToothDetail[] = [DETAIL_1, DETAIL_2];
});

