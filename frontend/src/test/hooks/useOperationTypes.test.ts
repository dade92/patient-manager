import {act, renderHook} from '@testing-library/react';
import {useOperationTypes} from '../../hooks/useOperationTypes';
import {RestClient} from '../../utils/restClient';
import {OperationType} from '../../types/OperationType';
import {Builder} from 'builder-pattern';

jest.mock('../../utils/restClient');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;

describe('useOperationTypes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully fetch and return operation types data', async () => {
        mockedRestClient.get.mockResolvedValue({types: OPERATION_TYPES});

        const {result} = renderHook(() => useOperationTypes());

        expect(result.current.loading).toBe(true);
        expect(result.current.operationTypes).toEqual([]);
        expect(result.current.error).toBeNull();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            operationTypes: OPERATION_TYPES,
            loading: false,
            error: null
        };

        expect(result.current).toEqual(expected);
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/operation-types');
        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching operation types fails', async () => {
        const error = new Error('Network error');
        mockedRestClient.get.mockRejectedValue(error);

        const {result} = renderHook(() => useOperationTypes());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            operationTypes: [],
            loading: false,
            error: 'Failed to load operation types'
        };

        expect(result.current).toEqual(expected);
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/operation-types');
        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
    });

    it('should set loading to true when starting to fetch and false after completion', async () => {
        let resolvePromise: () => void;
        const promise = new Promise<{ types: OperationType[] }>((resolve) => {
            resolvePromise = () => resolve({types: OPERATION_TYPES});
        });
        mockedRestClient.get.mockReturnValue(promise);

        const {result} = renderHook(() => useOperationTypes());

        expect(result.current.loading).toBe(true);
        expect(result.current.operationTypes).toEqual([]);
        expect(result.current.error).toBeNull();

        resolvePromise!();

        await act(async () => {
            await promise;
        });

        const expected = {
            operationTypes: OPERATION_TYPES,
            loading: false,
            error: null
        }

        expect(result.current).toEqual(expected);
        expect(mockedRestClient.get).toHaveBeenCalledWith('/api/operation-types');
        expect(mockedRestClient.get).toHaveBeenCalledTimes(1);
    });

    const OPERATION_TYPES: OperationType[] = [
        Builder<OperationType>()
            .type('CLEANING')
            .build(),
        Builder<OperationType>()
            .type('EXTRACTION')
            .build(),
        Builder<OperationType>()
            .type('FILLING')
            .build()
    ];
});
