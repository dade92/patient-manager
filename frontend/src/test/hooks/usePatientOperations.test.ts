import {act, renderHook} from '@testing-library/react';
import {usePatientOperations} from '../../hooks/usePatientOperations';
import {RestClient} from '../../utils/restClient';
import {useCache} from '../../context/CacheContext';
import {Operation} from '../../types/operation';
import {Builder} from 'builder-pattern';

jest.mock('../../utils/restClient');
jest.mock('../../context/CacheContext');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;
const mockedUseCache = useCache as jest.Mock;

describe('usePatientOperations', () => {
    const mockGetCachedOperationsForPatient = jest.fn();
    const mockSetCachedOperationsForPatient = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCache.mockReturnValue({
            getCachedOperationsForPatient: mockGetCachedOperationsForPatient,
            setCachedOperationsForPatient: mockSetCachedOperationsForPatient,
        });
    });

    it('should successfully fetch and save in cache', async () => {
        const operations: Operation[] = [
            createOperation(OPERATION_ID, PATIENT_ID),
            createOperation(ANOTHER_OPERATION_ID, PATIENT_ID)
        ];
        mockGetCachedOperationsForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValue({operations});

        const {result} = renderHook(() => usePatientOperations(PATIENT_ID));

        expect(result.current.loading).toBe(true);
        expect(result.current.operations).toEqual([]);
        expect(result.current.error).toBeNull();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            operations: operations,
            loading: false,
            error: null,
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/operation/patient/${PATIENT_ID}`);
        expect(mockSetCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID, operations);
    });

    it('should return cached operations when available', async () => {
        const cachedOperations: Operation[] = [
            createOperation('OP-003', PATIENT_ID)
        ];
        mockGetCachedOperationsForPatient.mockReturnValue(cachedOperations);

        const {result} = renderHook(() => usePatientOperations(PATIENT_ID));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            operations: cachedOperations,
            loading: false,
            error: null,
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).not.toHaveBeenCalled();
        expect(mockSetCachedOperationsForPatient).not.toHaveBeenCalled();
    });

    it('should handle 404 error by setting empty operations array', async () => {
        mockGetCachedOperationsForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockRejectedValue({status: 404, message: 'Operations not found'});

        const {result} = renderHook(() => usePatientOperations(PATIENT_ID));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            operations: [],
            loading: false,
            error: null,
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/operation/patient/${PATIENT_ID}`);
        expect(mockSetCachedOperationsForPatient).not.toHaveBeenCalled();
    });

    it('should refetch when patientId changes', async () => {
        const secondPatientId = 'PAT-002';
        const firstOperations: Operation[] = [createOperation(OPERATION_ID, PATIENT_ID)];
        const secondOperations: Operation[] = [createOperation(ANOTHER_OPERATION_ID, secondPatientId)];

        mockGetCachedOperationsForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValueOnce({operations: firstOperations});
        mockedRestClient.get.mockResolvedValueOnce({operations: secondOperations});

        const {result, rerender} = renderHook(
            ({patientId}) => usePatientOperations(patientId),
            {initialProps: {patientId: PATIENT_ID}}
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.operations).toEqual(firstOperations);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/operation/patient/${PATIENT_ID}`);

        rerender({patientId: secondPatientId});

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.operations).toEqual(secondOperations);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/operation/patient/${secondPatientId}`);
        expect(mockedRestClient.get).toHaveBeenCalledTimes(2);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledTimes(2)
    });

    it('should refetch when refreshTrigger changes', async () => {
        const operations: Operation[] = [createOperation(OPERATION_ID, PATIENT_ID)];

        mockGetCachedOperationsForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValue({operations});

        const {rerender} = renderHook(
            ({refreshTrigger}) => usePatientOperations(PATIENT_ID, refreshTrigger),
            {initialProps: {refreshTrigger: 1}}
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);

        rerender({refreshTrigger: 2});

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockedRestClient.get).toHaveBeenCalledTimes(2);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/operation/patient/${PATIENT_ID}`);
    });

    it('should set loading to true when starting to fetch and false after completion', async () => {
        const operations: Operation[] = [createOperation(OPERATION_ID, PATIENT_ID)];
        let resolvePromise: () => void;
        const promise = new Promise<{ operations: Operation[] }>((resolve) => {
            resolvePromise = () => resolve({operations});
        });
        mockGetCachedOperationsForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockReturnValue(promise);

        const {result} = renderHook(() => usePatientOperations(PATIENT_ID));

        expect(result.current.loading).toBe(true);
        expect(result.current.operations).toEqual([]);
        expect(result.current.error).toBeNull();

        resolvePromise!();

        await act(async () => {
            await promise;
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.operations).toEqual(operations);
        expect(result.current.error).toBeNull();
    });

    const PATIENT_ID = 'PAT-001';
    const OPERATION_ID = 'OP-001';
    const ANOTHER_OPERATION_ID = 'OP-002';
    const createOperation = (id: string, patientId: string): Operation =>
        Builder<Operation>()
            .id(id)
            .patientId(patientId)
            .build();
});
