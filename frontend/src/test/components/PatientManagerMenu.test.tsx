import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {PatientManagerMenu} from '../../components/PatientManagerMenu';
import {BrowserRouter} from 'react-router-dom';

describe('PatientManagerMenu', () => {
    const renderMenu = () => {
        return render(
            <BrowserRouter>
                <PatientManagerMenu/>
            </BrowserRouter>
        );
    };

    it('renders menu button', () => {
        renderMenu();

        expect(screen.getByTestId('menu-button')).toBeInTheDocument();
        expect(screen.getByLabelText('menu')).toBeInTheDocument();
        const ariaExpanded = screen.getByTestId('menu-button').getAttribute('aria-expanded');
        expect(ariaExpanded).not.toBe('true');
    });

    it('opens menu when button is clicked', () => {
        renderMenu();

        const menuButton = screen.getByTestId('menu-button');
        fireEvent.click(menuButton);

        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('new-patient-menu-item')).toBeVisible();
        expect(screen.getByTestId('operation-types-menu-item')).toBeVisible();
        expect(screen.getByTestId('new-patient-menu-item')).toHaveTextContent('New Patient');
        expect(screen.getByTestId('operation-types-menu-item')).toHaveTextContent('Operation types');

        const newPatientItem = screen.getByTestId('new-patient-menu-item');
        const operationTypesItem = screen.getByTestId('operation-types-menu-item');

        expect(newPatientItem).toHaveAttribute('href', '/new-patient');
        expect(operationTypesItem).toHaveAttribute('href', '/new-operation-type');
    });

    it('closes menu when menu item is clicked', () => {
        renderMenu();

        const menuButton = screen.getByTestId('menu-button');
        fireEvent.click(menuButton);
        expect(screen.getByTestId('new-patient-menu-item')).toBeVisible();

        fireEvent.click(screen.getByTestId('new-patient-menu-item'));

        expect(menuButton.getAttribute('aria-expanded')).not.toBe('true');
    });
});

