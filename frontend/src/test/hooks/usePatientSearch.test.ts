import {act, renderHook, waitFor} from '@testing-library/react';
import {usePatientSearch} from '../../hooks/usePatientSearch';
import {RestClient} from '../../utils/restClient';
import {Patient} from '../../types/patient';
import {Builder} from 'builder-pattern';

jest.mock('../../utils/restClient');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;

describe('usePatientSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should start with empty patients array and no error', () => {
        const {result} = renderHook(() => usePatientSearch());

        expect(result.current).toEqual({
            patients: [],
            error: null,
            searchPatients: expect.any(Function)
        });
    });

    it('should successfully search and return patients after debounce timeout', async () => {
        const patients: Patient[] = [
            createPatient(PATIENT_ID, 'John Doe'),
            createPatient('PAT-002', 'John Smith')
        ];
        const apiResponse = {patients};
        mockedRestClient.get.mockResolvedValue(apiResponse);

        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients(query);
        });
        act(() => {
            jest.advanceTimersByTime(400);
        });
        await waitFor(() => {
            expect(result.current.patients).toEqual(patients);
        });

        const expected = {
            patients: patients,
            error: null,
            searchPatients: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/search?name=${query}`);
        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
    });

    it('should not search when query length is less than 2 characters', async () => {
        const {result} = renderHook(() => usePatientSearch());
        const query = 'J';

        act(() => {
            result.current.searchPatients(query);
        });
        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual([]);
        });

        expect(result.current.error).toBeNull();
        expect(mockedRestClient.get).not.toHaveBeenCalled();
    });

    it('should handle 404 error by setting empty patients array', async () => {
        const query = 'NonExistent';
        mockedRestClient.get.mockRejectedValue({status: 404, message: 'Patients not found'});

        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients(query);
        });
        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual([]);
        });

        const expected = {
            patients: [],
            error: null,
            searchPatients: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/search?name=${query}`);
    });

    it('should debounce search requests and only call API once', async () => {
        const patients: Patient[] = [createPatient(PATIENT_ID, 'John Doe')];
        mockedRestClient.get.mockResolvedValue({patients});
        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients('J');
        });
        act(() => {
            jest.advanceTimersByTime(100);
        });
        act(() => {
            result.current.searchPatients('Jo');
        });
        act(() => {
            jest.advanceTimersByTime(100);
        });
        act(() => {
            result.current.searchPatients(query);
        });
        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual(patients);
        });

        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/search?name=${query}`);
    });

    it('should handle empty search results', async () => {
        const apiResponse = {patients: []};
        mockedRestClient.get.mockResolvedValue(apiResponse);
        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients(query);
        });
        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual([]);
        });

        expect(result.current.error).toBeNull();
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/search?name=${query}`);
    });

    const PATIENT_ID = 'PAT-001';
    const query = 'John';
    const createPatient = (id: string, name: string): Patient =>
        Builder<Patient>()
            .id(id)
            .name(name)
            .build();
});
