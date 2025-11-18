import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {PatientListItem} from '../../../components/lists/PatientListItem';
import {Patient} from '../../../types/patient';
import {Builder} from 'builder-pattern';

describe('PatientListItem', () => {
    const onClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders patient name and secondary text', () => {
        render(<PatientListItem patient={PATIENT} onPatientClick={onClick}/>);

        const button = screen.getByTestId('patient-list-item-button');
        const text = screen.getByTestId('patient-list-item-text');

        expect(button).toBeInTheDocument();
        expect(text).toHaveTextContent(NAME);
        expect(text).toHaveTextContent(`${TAX_CODE} • ${EMAIL}`);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('invokes callback with patient id on click', () => {
        render(<PatientListItem patient={PATIENT} onPatientClick={onClick}/>);

        fireEvent.click(screen.getByTestId('patient-list-item-button'));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(PATIENT_ID);
    });

    const PATIENT_ID = 'PAT-123';
    const NAME = 'Jane Smith';
    const EMAIL = 'jane.smith@example.com';
    const TAX_CODE = 'TAX123SMITH';
    const PATIENT: Patient = Builder<Patient>()
        .id(PATIENT_ID)
        .name(NAME)
        .email(EMAIL)
        .taxCode(TAX_CODE)
        .build();
});