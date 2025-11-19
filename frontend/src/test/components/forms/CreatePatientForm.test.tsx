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
    const onPatientCreated = jest.fn();
    const onCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseCreatePatient.error = null;
        mockUseCreatePatient.isSubmitting = false;
        useCreatePatient.mockReturnValue(mockUseCreatePatient);
    });

    it('renders all necessary components', () => {
        render(<CreatePatientForm onPatientCreated={onPatientCreated} onCancel={onCancel}/>);

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
        const createdPatient = buildPatient(formData.name, formData.email);
        createPatient.mockResolvedValue(createdPatient);

        render(<CreatePatientForm onPatientCreated={onPatientCreated} onCancel={onCancel}/>);

        compileForm(formData);

        fireEvent.click(screen.getByTestId('create-patient-button'));

        await waitFor(() => {
            expect(createPatient).toHaveBeenCalledWith(formData);
            expect(onPatientCreated).toHaveBeenCalledWith(createdPatient);
            expect(onPatientCreated).toHaveBeenCalledTimes(1);
        });
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<CreatePatientForm onPatientCreated={onPatientCreated} onCancel={onCancel}/>);

        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onPatientCreated).not.toHaveBeenCalled();
    });

    const ID = 'PAT-001';

    const buildPatient = (name: string, email: string): Patient =>
        Builder<Patient>()
            .id(ID)
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
    const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        taxCode: 'JDOE123',
        phoneNumber: '+1234567890',
        address: '123 Main St',
        cityOfResidence: 'New York',
        nationality: 'USA',
        birthDate: '1990-01-01',
        medicalHistory: 'No allergies'
    };

    const compileForm = (formData: {
        name: string;
        email: string;
        taxCode: string;
        phoneNumber: string;
        address: string;
        cityOfResidence: string;
        nationality: string;
        birthDate: string;
        medicalHistory: string
    }) => {
        fireEvent.change(screen.getByTestId('name-input').querySelector('input')!, {target: {value: formData.name}});
        fireEvent.change(screen.getByTestId('email-input').querySelector('input')!, {target: {value: formData.email}});
        fireEvent.change(screen.getByTestId('tax-code-input').querySelector('input')!, {target: {value: formData.taxCode}});
        fireEvent.change(screen.getByTestId('phone-number-input').querySelector('input')!, {target: {value: formData.phoneNumber}});
        fireEvent.change(screen.getByTestId('address-input').querySelector('input')!, {target: {value: formData.address}});
        fireEvent.change(screen.getByTestId('city-input').querySelector('input')!, {target: {value: formData.cityOfResidence}});
        fireEvent.change(screen.getByTestId('nationality-input').querySelector('input')!, {target: {value: formData.nationality}});
        fireEvent.change(screen.getByTestId('birth-date-input').querySelector('input')!, {target: {value: formData.birthDate}});
        fireEvent.change(screen.getByTestId('medical-history-input').querySelector('input')!, {target: {value: formData.medicalHistory}});
    };
});
