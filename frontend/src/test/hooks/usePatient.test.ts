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

    it('should successfully fetch and cache the retrieved patient', async () => {
        mockGetCachedPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValue(PATIENT);

        const {result} = renderHook(() => usePatient(PATIENT_ID));

        expect(result.current.loading).toBe(true);
        expect(result.current.patient).toBeUndefined();
        expect(result.current.error).toBeNull();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            patient: PATIENT,
            loading: false,
            error: null
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedPatient).toHaveBeenCalledWith(PATIENT_ID);
        expect(mockGetCachedPatient).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${PATIENT_ID}`);
        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
        expect(mockSetCachedPatient).toHaveBeenCalledWith(PATIENT_ID, PATIENT);
    });

    it('should return cached patient when available', async () => {
        const cachedPatient: Patient = Builder<Patient>().build();
        mockGetCachedPatient.mockReturnValue(cachedPatient);

        const {result} = renderHook(() => usePatient(PATIENT_ID));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            patient: cachedPatient,
            loading: false,
            error: null
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedPatient).toHaveBeenCalledWith(PATIENT_ID);
        expect(mockGetCachedPatient).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).not.toHaveBeenCalled();
        expect(mockSetCachedPatient).not.toHaveBeenCalled();
    });

    it('should handle 404 error with specific message', async () => {
        mockGetCachedPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockRejectedValue({
            status: 404,
            message: 'Patient not found'
        });

        const {result} = renderHook(() => usePatient(PATIENT_ID));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            patient: undefined,
            loading: false,
            error: `Patient with ID ${PATIENT_ID} was not found`
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedPatient).toHaveBeenCalledWith(PATIENT_ID);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${PATIENT_ID}`);
        expect(mockSetCachedPatient).not.toHaveBeenCalled();
    });

    it('should refetch when patientId changes', async () => {
        const secondPatientId = 'PAT-002';
        const firstPatient: Patient = Builder<Patient>()
            .id(PATIENT_ID)
            .build();
        const secondPatient: Patient = Builder<Patient>()
            .id(secondPatientId)
            .build();
        mockGetCachedPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValueOnce(firstPatient);
        mockedRestClient.get.mockResolvedValueOnce(secondPatient);

        const {result, rerender} = renderHook(
            ({patientId}) => usePatient(patientId),
            {initialProps: {patientId: PATIENT_ID}}
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.patient).toEqual(firstPatient);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${PATIENT_ID}`);

        rerender({patientId: secondPatientId});

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.patient).toEqual(secondPatient);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/patient/${secondPatientId}`);
        expect(mockedRestClient.get).toHaveBeenCalledTimes(2);
    });

    it('should set loading to true when starting to fetch', async () => {
        const patient: Patient = Builder<Patient>().build();
        mockGetCachedPatient.mockReturnValue(undefined);

        let resolvePromise: () => void;
        const promise = new Promise<Patient>((resolve) => {
            resolvePromise = () => resolve(patient);
        });

        mockedRestClient.get.mockReturnValue(promise);

        const {result} = renderHook(() => usePatient(PATIENT_ID));

        expect(result.current).toEqual({
            patient: undefined,
            loading: true,
            error: null
        });

        resolvePromise!();

        await act(async () => {
            await promise;
        });

        const expected = {
            patient: patient,
            loading: false,
            error: null
        }

        expect(result.current).toEqual(expected);
    });

    const PATIENT_ID = 'PAT-001';
    const PATIENT = Builder<Patient>().id(PATIENT_ID).build();
});
