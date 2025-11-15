import {act, renderHook} from '@testing-library/react';
import {useCreatePatient} from '../../hooks/useCreatePatient';
import {RestClient} from '../../utils/restClient';
import {NewPatientForm} from '../../components/forms/CreatePatientForm';
import {Patient} from '../../types/patient';
import {Builder} from 'builder-pattern';

jest.mock('../../utils/restClient');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;

describe('useCreatePatient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully create a patient', async () => {
        const formData = Builder<NewPatientForm>().build();
        const createdPatient: Patient = Builder<Patient>().build();
        mockedRestClient.post.mockResolvedValue(createdPatient);

        const {result} = renderHook(() => useCreatePatient());

        let patient;
        await act(async () => {
            patient = await result.current.createPatient(formData);
        });

        const expected = {
            createPatient: expect.any(Function),
            error: null,
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(patient).toEqual(createdPatient);
        expect(mockedRestClient.post).toHaveBeenCalledWith('/api/patient', formData);
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });

    it('should handle error when creating patient fails', async () => {
        const formData = Builder<NewPatientForm>().build();
        mockedRestClient.post.mockRejectedValue(new Error());

        const {result} = renderHook(() => useCreatePatient());

        let patient;
        await act(async () => {
            patient = await result.current.createPatient(formData);
        });

        const expected = {
            createPatient: expect.any(Function),
            error: 'Failed to create patient. Please try again.',
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(patient).toBeNull();
        expect(mockedRestClient.post).toHaveBeenCalledWith('/api/patient', formData);
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });
});
