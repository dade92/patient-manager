import {act, renderHook, waitFor} from '@testing-library/react';
import {useOperation} from '../../hooks/useOperation';
import {RestClient} from '../../utils/restClient';
import {useCache} from '../../context/CacheContext';
import {Operation} from '../../types/operation';
import {Builder} from "builder-pattern";

jest.mock('../../utils/restClient');
jest.mock('../../context/CacheContext');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;
const mockedUseCache = useCache as jest.Mock;

describe('useOperation', () => {
    const getCachedOperation = jest.fn();
    const setCachedOperation = jest.fn();
    const getCachedOperationsForPatient = jest.fn();
    const setCachedOperationsForPatient = jest.fn();

    const mockCacheReturn = () => {
        mockedUseCache.mockReturnValue({
            getCachedOperation,
            setCachedOperation,
            getCachedOperationsForPatient,
            setCachedOperationsForPatient
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockCacheReturn();
    });

    it('returns immediately when operationId is empty', async () => {
        const {result} = renderHook(() => useOperation(''));
        await waitFor(() => expect(result.current.loading).toBe(false));
        const expected = {
            operation: undefined,
            loading: false,
            error: null,
            updateOperation: expect.any(Function)
        };
        expect(result.current).toEqual(expected);
        expect(getCachedOperation).not.toHaveBeenCalled();
        expect(mockedRestClient.get).not.toHaveBeenCalled();
    });

    it('uses cached operation if present', async () => {
        const cached = createOperation();
        getCachedOperation.mockReturnValue(cached);

        const {result} = renderHook(() => useOperation(OPERATION_ID));
        await waitFor(() => expect(result.current.loading).toBe(false));

        const expected = {
            operation: cached,
            loading: false,
            error: null,
            updateOperation: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(getCachedOperation).toHaveBeenCalledWith(OPERATION_ID);
        expect(mockedRestClient.get).not.toHaveBeenCalled();
        expect(setCachedOperation).not.toHaveBeenCalled();
    });

    it('fetches operation from server when not cached', async () => {
        const fetched = createOperation();
        getCachedOperation.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValue(fetched);

        const {result} = renderHook(() => useOperation(OPERATION_ID));
        await waitFor(() => result.current.operation !== undefined);

        const expected = {
            operation: fetched,
            loading: false,
            error: null,
            updateOperation: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(getCachedOperation).toHaveBeenCalledWith(OPERATION_ID);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/operation/${OPERATION_ID}`);
        expect(setCachedOperation).toHaveBeenCalledWith(OPERATION_ID, fetched);
    });

    it('handles correctly operation not found', async () => {
        getCachedOperation.mockReturnValue(undefined);
        mockedRestClient.get.mockRejectedValue({status: 404});

        const {result} = renderHook(() => useOperation(OPERATION_ID));
        await waitFor(() => result.current.error !== null);

        const expected = {
            operation: undefined,
            loading: false,
            error: `Operation with ID ${OPERATION_ID} was not found`,
            updateOperation: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(setCachedOperation).not.toHaveBeenCalled();
    });

    it('sets generic error on non-404 failure', async () => {
        getCachedOperation.mockReturnValue(undefined);
        mockedRestClient.get.mockRejectedValue(new Error('Boom'));

        const {result} = renderHook(() => useOperation(OPERATION_ID));
        await waitFor(() => result.current.error !== null);

        const expected = {
            operation: undefined,
            loading: false,
            error: 'An error occurred while fetching the operation data',
            updateOperation: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
    });

    it('updateOperation updates state and patient cache list', async () => {
        const cached = createOperation();
        getCachedOperation.mockReturnValue(cached);
        getCachedOperationsForPatient.mockReturnValue([cached]);

        const {result} = renderHook(() => useOperation(OPERATION_ID));
        await waitFor(() => !result.current.loading);

        const updated: Operation = {
            ...cached,
            description: 'Updated desc',
            updatedAt: '2025-01-02T11:00:00'
        };

        act(() => {
            result.current.updateOperation(updated);
        });

        const expected = {
            operation: updated,
            loading: false,
            error: null,
            updateOperation: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(setCachedOperation).toHaveBeenCalledWith(OPERATION_ID, updated);
        expect(setCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID, [updated]);
    });

    const createOperation = (): Operation =>
        Builder<Operation>()
            .id(OPERATION_ID)
            .patientId(PATIENT_ID)
            .build()
    const OPERATION_ID = 'OP-ID';
    const PATIENT_ID = 'PAT-ID';
});

