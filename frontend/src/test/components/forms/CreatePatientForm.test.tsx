import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {CreatePatientForm} from '../../../components/forms/CreatePatientForm';
import {Patient} from '../../../types/patient';
import {Builder} from 'builder-pattern';

const createPatient = jest.fn();
const mockUseCreatePatient = {
    createPatient: createPatient,
    error: null as string | null,
    isSubmitting: false
};

jest.mock('../../../hooks/useCreatePatient', () => ({
    useCreatePatient: jest.fn(() => mockUseCreatePatient)
}));

const {useCreatePatient} = require('../../../hooks/useCreatePatient');

describe('CreatePatientForm', () => {
    const mockOnPatientCreated = jest.fn();
    const onCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseCreatePatient.error = null;
        mockUseCreatePatient.isSubmitting = false;
        useCreatePatient.mockReturnValue(mockUseCreatePatient);
    });

    it('renders all necessary components', () => {
        render(<CreatePatientForm onPatientCreated={mockOnPatientCreated} onCancel={onCancel}/>);

        expect(screen.getByTestId('create-patient-form')).toBeInTheDocument();
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('tax-code-input')).toBeInTheDocument();
        expect(screen.getByTestId('phone-number-input')).toBeInTheDocument();
        expect(screen.getByTestId('address-input')).toBeInTheDocument();
        expect(screen.getByTestId('city-input')).toBeInTheDocument();
        expect(screen.getByTestId('nationality-input')).toBeInTheDocument();
        expect(screen.getByTestId('birth-date-input')).toBeInTheDocument();
        expect(screen.getByTestId('medical-history-input')).toBeInTheDocument();

        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
        expect(screen.getByTestId('create-patient-button')).toBeInTheDocument();

        expect(screen.queryByTestId('create-patient-error-alert')).not.toBeInTheDocument();
    });

    it('calls onPatientCreated with correct patient when form is submitted successfully', async () => {
        const createdPatient = buildPatient('PAT-001', 'John Doe', 'john@example.com');
        createPatient.mockResolvedValue(createdPatient);

        render(<CreatePatientForm onPatientCreated={mockOnPatientCreated} onCancel={onCancel}/>);

        fireEvent.change(screen.getByTestId('name-input').querySelector('input')!, {target: {value: 'John Doe'}});
        fireEvent.change(screen.getByTestId('email-input').querySelector('input')!, {target: {value: 'john@example.com'}});
        fireEvent.change(screen.getByTestId('tax-code-input').querySelector('input')!, {target: {value: 'JDOE123'}});
        fireEvent.change(screen.getByTestId('phone-number-input').querySelector('input')!, {target: {value: '+1234567890'}});
        fireEvent.change(screen.getByTestId('address-input').querySelector('input')!, {target: {value: '123 Main St'}});
        fireEvent.change(screen.getByTestId('city-input').querySelector('input')!, {target: {value: 'New York'}});
        fireEvent.change(screen.getByTestId('nationality-input').querySelector('input')!, {target: {value: 'USA'}});
        fireEvent.change(screen.getByTestId('birth-date-input').querySelector('input')!, {target: {value: '1990-01-01'}});
        fireEvent.change(screen.getByTestId('medical-history-input').querySelector('input')!, {target: {value: 'No allergies'}});

        fireEvent.click(screen.getByTestId('create-patient-button'));

        await waitFor(() => {
            expect(createPatient).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                taxCode: 'JDOE123',
                phoneNumber: '+1234567890',
                address: '123 Main St',
                cityOfResidence: 'New York',
                nationality: 'USA',
                birthDate: '1990-01-01',
                medicalHistory: 'No allergies'
            });
            expect(mockOnPatientCreated).toHaveBeenCalledWith(createdPatient);
            expect(mockOnPatientCreated).toHaveBeenCalledTimes(1);
        });
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<CreatePatientForm onPatientCreated={mockOnPatientCreated} onCancel={onCancel}/>);

        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(mockOnPatientCreated).not.toHaveBeenCalled();
    });

    const buildPatient = (id: string, name: string, email: string): Patient => {
        return Builder<Patient>()
            .id(id)
            .name(name)
            .email(email)
            .phoneNumber('+1234567890')
            .address('123 Main St')
            .cityOfResidence('New York')
            .nationality('USA')
            .birthDate('1990-01-01')
            .taxCode('JDOE123')
            .medicalHistory('No allergies')
            .build();
    };
});
