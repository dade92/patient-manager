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

        const expected = {
            patients: [],
            error: null,
            searchPatients: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
    });

    it('should successfully search and return patients after debounce timeout', async () => {
        const patients: Patient[] = [
            createMockPatient('PAT-001', 'John Doe'),
            createMockPatient('PAT-002', 'John Smith')
        ];

        const apiResponse = {patients};
        mockedRestClient.get.mockResolvedValue(apiResponse);

        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients('John');
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
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/patient/search?name=John');
        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
    });

    it('should not search when query length is less than 2 characters', async () => {
        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients('J');
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

    it('should clear patients array when query becomes less than 2 characters', async () => {
        const patients: Patient[] = [createMockPatient('PAT-001', 'John Doe')];
        mockedRestClient.get.mockResolvedValue({patients});

        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients('John');
        });
        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual(patients);
        });

        act(() => {
            result.current.searchPatients('J');
        });

        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual([]);
        });

        expect(result.current.error).toBeNull();
    });

    it('should handle 404 error by setting empty patients array', async () => {
        const error = {
            name: 'ApiError',
            status: 404,
            message: 'Patients not found'
        };

        mockedRestClient.get.mockRejectedValue(error);

        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients('NonExistent');
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
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/patient/search?name=NonExistent');
    });

    it('should handle general error with error message', async () => {
        const error = new Error('Network error');
        mockedRestClient.get.mockRejectedValue(error);

        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients('John');
        });

        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.error).toBe('An error occurred while searching for patients.');
        });

        const expected = {
            patients: [],
            error: 'An error occurred while searching for patients.',
            searchPatients: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/patient/search?name=John');
    });

    it('should debounce search requests and only call API once', async () => {
        const patients: Patient[] = [createMockPatient('PAT-001', 'John Doe')];
        mockedRestClient.get.mockResolvedValue({patients});

        const {result} = renderHook(() => usePatientSearch());

        // Trigger multiple searches rapidly
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
            result.current.searchPatients('Joh');
        });

        act(() => {
            jest.advanceTimersByTime(100);
        });

        act(() => {
            result.current.searchPatients('John');
        });

        // Fast-forward to complete the debounce timeout
        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual(patients);
        });

        // Should only call API once with the final query
        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/patient/search?name=John');
    });

    it('should handle empty search results', async () => {
        const apiResponse = {patients: []};
        mockedRestClient.get.mockResolvedValue(apiResponse);

        const {result} = renderHook(() => usePatientSearch());

        act(() => {
            result.current.searchPatients('Unknown');
        });

        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual([]);
        });

        expect(result.current.error).toBeNull();
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/patient/search?name=Unknown');
    });

    it('should clear error when query becomes less than 2 characters', async () => {
        const error = new Error('Network error');
        mockedRestClient.get.mockRejectedValue(error);

        const {result} = renderHook(() => usePatientSearch());

        // First search fails
        act(() => {
            result.current.searchPatients('John');
        });

        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.error).toBe('An error occurred while searching for patients.');
        });

        // Clear search by setting short query
        act(() => {
            result.current.searchPatients('J');
        });

        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
        });

        expect(result.current.patients).toEqual([]);
    });

    it('should handle rapid query changes correctly', async () => {
        const firstPatients: Patient[] = [createMockPatient('PAT-001', 'Alice')];
        const secondPatients: Patient[] = [createMockPatient('PAT-002', 'Bob')];

        mockedRestClient.get.mockResolvedValueOnce({patients: firstPatients});
        mockedRestClient.get.mockResolvedValueOnce({patients: secondPatients});

        const {result} = renderHook(() => usePatientSearch());

        // First search
        act(() => {
            result.current.searchPatients('Alice');
        });

        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual(firstPatients);
        });

        // Second search
        act(() => {
            result.current.searchPatients('Bob');
        });

        act(() => {
            jest.advanceTimersByTime(400);
        });

        await waitFor(() => {
            expect(result.current.patients).toEqual(secondPatients);
        });

        expect(mockedRestClient.get).toHaveBeenCalledTimes(2);
        expect(mockedRestClient.get).toHaveBeenNthCalledWith(1, '/api/patient/search?name=Alice');
        expect(mockedRestClient.get).toHaveBeenNthCalledWith(2, '/api/patient/search?name=Bob');
    });

    const createMockPatient = (id: string, name: string): Patient => {
        return Builder<Patient>()
            .id(id)
            .name(name)
            .build();
    };
});
