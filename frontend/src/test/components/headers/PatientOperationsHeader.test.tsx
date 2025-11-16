import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {PatientOperationsHeader} from '../../../components/headers/PatientOperationsHeader';

describe('PatientOperationsHeader', () => {
    it('renders with expanded state', () => {
        const onToggle = jest.fn();

        render(<PatientOperationsHeader expanded={true} onToggle={onToggle}/>);

        expect(screen.getByTestId('patient-operations-header')).toBeInTheDocument();
        expect(screen.getByTestId('operations-title')).toHaveTextContent(TITLE);
        expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
        expect(screen.getByTestId('collapse-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('expand-icon')).not.toBeInTheDocument();
    });

    it('renders with collapsed state', () => {
        const onToggle = jest.fn();

        render(<PatientOperationsHeader expanded={false} onToggle={onToggle}/>);

        expect(screen.getByTestId('patient-operations-header')).toBeInTheDocument();
        expect(screen.getByTestId('operations-title')).toHaveTextContent(TITLE);
        expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
        expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('collapse-icon')).not.toBeInTheDocument();
    });

    it('calls onToggle when header is clicked', () => {
        const onToggle = jest.fn();

        render(<PatientOperationsHeader expanded={false} onToggle={onToggle}/>);

        fireEvent.click(screen.getByTestId('patient-operations-header'));

        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle when toggle button is clicked', () => {
        const onToggle = jest.fn();

        render(<PatientOperationsHeader expanded={false} onToggle={onToggle}/>);

        fireEvent.click(screen.getByTestId('toggle-button'));

        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle multiple times on repeated clicks', () => {
        const onToggle = jest.fn();

        render(<PatientOperationsHeader expanded={false} onToggle={onToggle}/>);

        const header = screen.getByTestId('patient-operations-header');
        fireEvent.click(header);
        fireEvent.click(header);
        fireEvent.click(header);

        expect(onToggle).toHaveBeenCalledTimes(3);
    });

    const TITLE = 'Operations History';
});

