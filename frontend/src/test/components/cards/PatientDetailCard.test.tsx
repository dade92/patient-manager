import React from 'react';
import {render, screen} from '@testing-library/react';
import {PatientDetailCard} from '../../../components/cards/PatientDetailCard';
import {Patient} from '../../../types/patient';
import {Builder} from "builder-pattern";

describe('PatientDetailCard', () => {
    it('renders correctly', () => {
        render(<PatientDetailCard patient={PATIENT}/>);

        expect(screen.getByTestId('patient-detail-card')).toBeInTheDocument();
        expect(screen.getByTestId('patient-name')).toHaveTextContent(NAME);
        expect(screen.getByTestId('patient-id-chip')).toHaveTextContent(ID);
        expect(screen.getByTestId('patient-email')).toHaveTextContent(EMAIL);
        expect(screen.getByTestId('patient-tax-code')).toHaveTextContent(TAX_CODE);
        expect(screen.getByTestId('patient-phone')).toHaveTextContent(PHONE);
        expect(screen.getByTestId('patient-address')).toHaveTextContent(ADDRESS);
        expect(screen.getByTestId('patient-city')).toHaveTextContent(CITY);
        expect(screen.getByTestId('patient-nationality')).toHaveTextContent(NATIONALITY);
        expect(screen.getByTestId('patient-birth-date')).toHaveTextContent(BIRTH_DATE_FORMATTED);
        expect(screen.getByTestId('patient-medical-history')).toHaveTextContent(MEDICAL_HISTORY);
    });

    const ID = 'PAT-123';
    const NAME = 'John Doe';
    const EMAIL = 'john.doe@example.com';
    const PHONE = '+1234567890';
    const ADDRESS = '123 Main St';
    const CITY = 'Milan';
    const NATIONALITY = 'Italian';
    const BIRTH_DATE_RAW = '2025-01-15';
    const BIRTH_DATE_FORMATTED = '15/01/2025';
    const TAX_CODE = 'TAXCODE123';
    const MEDICAL_HISTORY = 'No significant issues';
    const PATIENT = Builder<Patient>()
        .id(ID)
        .name(NAME)
        .email(EMAIL)
        .phoneNumber(PHONE)
        .address(ADDRESS)
        .cityOfResidence(CITY)
        .nationality(NATIONALITY)
        .birthDate(BIRTH_DATE_RAW)
        .taxCode(TAX_CODE)
        .medicalHistory(MEDICAL_HISTORY)
        .build();
});
