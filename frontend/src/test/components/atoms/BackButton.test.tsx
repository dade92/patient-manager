import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {BackButton} from '../../../components/atoms/BackButton';
import {BrowserRouter} from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock(
    'react-router-dom',
    () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
    }));

describe('BackButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderBackButton = (props = {}) => {
        return render(
            <BrowserRouter>
                <BackButton {...props} />
            </BrowserRouter>
        );
    };

    it('should render the button correctly', () => {
        renderBackButton();

        const button = screen.getByTestId('back-button');
        expect(button).toBeInTheDocument();
        const icon = button.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('should show tooltip on hover', async () => {
        renderBackButton();

        const button = screen.getByTestId('back-button');

        fireEvent.mouseOver(button);

        const tooltip = await screen.findByText('Go back');
        expect(tooltip).toBeInTheDocument();
    });

    it('should call navigate(-1) when clicked', () => {
        renderBackButton();

        const button = screen.getByTestId('back-button');
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks correctly', () => {
        renderBackButton();

        const button = screen.getByTestId('back-button');

        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledTimes(3);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
