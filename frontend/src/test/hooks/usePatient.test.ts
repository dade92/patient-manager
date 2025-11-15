import {act, renderHook} from '@testing-library/react';
import {usePatient} from '../../hooks/usePatient';
import {RestClient} from '../../utils/restClient';
import {useCache} from '../../context/CacheContext';
import {Patient} from '../../types/patient';
import {Builder} from 'builder-pattern';

jest.mock('../../utils/restClient');
jest.mock('../../context/CacheContext');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;
const mockedUseCache = useCache as jest.Mock;

describe('usePatient', () => {
    const mockGetCachedPatient = jest.fn();
    const mockSetCachedPatient = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCache.mockReturnValue({
            getCachedPatient: mockGetCachedPatient,
            setCachedPatient: mockSetCachedPatient,
        });
    });

    it('should successfully fetch and return patient data', async () => {
        const patientId = 'PAT-001';
        const patient = Builder<Patient>().build();

        mockGetCachedPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValue(patient);

        const {result} = renderHook(() => usePatient(patientId));

        expect(result.current.loading).toBe(true);
        expect(result.current.patient).toBeUndefined();
        expect(result.current.error).toBeNull();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            patient: patient,
            loading: false,
            error: null
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedPatient).toHaveBeenCalledWith(patientId);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${patientId}`);
        expect(mockSetCachedPatient).toHaveBeenCalledWith(patientId, patient);
    });

    it('should return cached patient when available', async () => {
        const patientId = 'PAT-002';
        const cachedPatient: Patient = Builder<Patient>().build();
        mockGetCachedPatient.mockReturnValue(cachedPatient);

        const {result} = renderHook(() => usePatient(patientId));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            patient: cachedPatient,
            loading: false,
            error: null
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedPatient).toHaveBeenCalledWith(patientId);
        expect(mockedRestClient.get).not.toHaveBeenCalled();
        expect(mockSetCachedPatient).not.toHaveBeenCalled();
    });

    it('should handle 404 error with specific message', async () => {
        const patientId = 'PAT-999';
        const error = {
            name: 'ApiError',
            status: 404,
            message: 'Patient not found'
        };
        mockGetCachedPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockRejectedValue(error);

        const {result} = renderHook(() => usePatient(patientId));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            patient: undefined,
            loading: false,
            error: `Patient with ID ${patientId} was not found`
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedPatient).toHaveBeenCalledWith(patientId);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${patientId}`);
        expect(mockSetCachedPatient).not.toHaveBeenCalled();
    });

    it('should handle general error with default message', async () => {
        const patientId = 'PAT-003';
        const error = new Error('Network error');

        mockGetCachedPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockRejectedValue(error);

        const {result} = renderHook(() => usePatient(patientId));

        // Wait for the effect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            patient: undefined,
            loading: false,
            error: 'An error occurred while fetching the patient data'
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedPatient).toHaveBeenCalledWith(patientId);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${patientId}`);
        expect(mockSetCachedPatient).not.toHaveBeenCalled();
    });

    it('should refetch when patientId changes', async () => {
        const firstPatientId = 'PAT-001';
        const secondPatientId = 'PAT-002';
        const firstPatient: Patient = Builder<Patient>()
            .id(firstPatientId)
            .build();
        const secondPatient: Patient = Builder<Patient>()
            .id(secondPatientId)
            .build();
        mockGetCachedPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValueOnce(firstPatient);
        mockedRestClient.get.mockResolvedValueOnce(secondPatient);

        const {result, rerender} = renderHook(
            ({patientId}) => usePatient(patientId),
            {initialProps: {patientId: firstPatientId}}
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.patient).toEqual(firstPatient);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${firstPatientId}`);

        // Change patientId
        rerender({patientId: secondPatientId});

        // Wait for second patient to load
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.patient).toEqual(secondPatient);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${secondPatientId}`);
        expect(mockedRestClient.get).toHaveBeenCalledTimes(2);
    });

    it('should set loading to true when starting to fetch', async () => {
        const patientId = 'PAT-001';
        const patient: Patient = Builder<Patient>().build();
        mockGetCachedPatient.mockReturnValue(undefined);

        let resolvePromise: () => void;
        const promise = new Promise<Patient>((resolve) => {
            resolvePromise = () => resolve(patient);
        });

        mockedRestClient.get.mockReturnValue(promise);

        const {result} = renderHook(() => usePatient(patientId));

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();

        resolvePromise!();

        await act(async () => {
            await promise;
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.patient).toEqual(patient);
    });
});
