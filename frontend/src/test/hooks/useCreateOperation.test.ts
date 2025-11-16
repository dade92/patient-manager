import {act, renderHook} from '@testing-library/react';
import {useCreateOperation} from '../../hooks/useCreateOperation';
import {RestClient} from '../../utils/restClient';
import {adaptOperationPayload} from '../../utils/CreateOperationPayloadAdapter';
import {useCache} from '../../context/CacheContext';
import {OperationForm} from '../../components/forms/CreateOperationForm';
import {Operation} from '../../types/operation';
import {Builder} from 'builder-pattern';

jest.mock('../../utils/restClient');
jest.mock('../../utils/CreateOperationPayloadAdapter');
jest.mock('../../context/CacheContext');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;
const mockedAdaptOperationPayload = adaptOperationPayload as jest.Mock;
const mockedUseCache = useCache as jest.Mock;

describe('useCreateOperation', () => {
    const mockGetCachedOperationsForPatient = jest.fn();
    const mockSetCachedOperationsForPatient = jest.fn();
    const patientId = 'PAT-001';

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCache.mockReturnValue({
            getCachedOperationsForPatient: mockGetCachedOperationsForPatient,
            setCachedOperationsForPatient: mockSetCachedOperationsForPatient
        });
    });

    it('should successfully create an operation and update cache', async () => {
        const formData = Builder<OperationForm>()
            .type('CLEANING')
            .patientId(patientId)
            .description('Dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([])
            .build();
        const adaptedPayload = {
            type: 'CLEANING',
            patientId: patientId,
            description: 'Dental cleaning',
            executor: 'Dr. Smith',
            estimatedCost: {amount: 100, currency: 'EUR'},
            toothDetails: []
        };
        const createdOperation: Operation = Builder<Operation>()
            .id('OP-001')
            .patientId(patientId)
            .type('CLEANING')
            .description('Dental cleaning')
            .executor('Dr. Smith')
            .build();
        const existingOperations: Operation[] = [
            Builder<Operation>().id('OP-002').patientId(patientId).build()
        ];

        mockedAdaptOperationPayload.mockReturnValue(adaptedPayload);
        mockedRestClient.post.mockResolvedValue(createdOperation);
        mockGetCachedOperationsForPatient.mockReturnValue(existingOperations);

        const {result} = renderHook(() => useCreateOperation({patientId}));

        let operation;
        await act(async () => {
            operation = await result.current.createOperation(formData);
        });

        const expected = {
            createOperation: expect.any(Function),
            error: null,
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(operation).toEqual(createdOperation);
        expect(mockedAdaptOperationPayload).toHaveBeenCalledWith(formData);
        expect(mockedRestClient.post).toHaveBeenCalledWith('/api/operation', adaptedPayload);
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledWith(patientId);
        expect(mockSetCachedOperationsForPatient).toHaveBeenCalledWith(patientId, [createdOperation, ...existingOperations]);
    });

    it('should handle error when creating operation fails', async () => {
        const formData = Builder<OperationForm>()
            .type('CLEANING')
            .patientId(patientId)
            .description('Dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([])
            .build();
        const errorMessage = 'Network error';

        mockedAdaptOperationPayload.mockReturnValue({});
        mockedRestClient.post.mockRejectedValue(new Error(errorMessage));

        const {result} = renderHook(() => useCreateOperation({patientId}));

        let operation;
        await act(async () => {
            operation = await result.current.createOperation(formData);
        });

        const expected = {
            createOperation: expect.any(Function),
            error: errorMessage,
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(operation).toBeNull();
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
        expect(mockSetCachedOperationsForPatient).not.toHaveBeenCalled();
    });

    it('should handle case when no cached operations exist', async () => {
        const formData = Builder<OperationForm>()
            .type('CLEANING')
            .patientId(patientId)
            .description('Dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([])
            .build();
        const createdOperation: Operation = Builder<Operation>()
            .id('OP-001')
            .patientId(patientId)
            .build();

        mockedAdaptOperationPayload.mockReturnValue({});
        mockedRestClient.post.mockResolvedValue(createdOperation);
        mockGetCachedOperationsForPatient.mockReturnValue(null);

        const {result} = renderHook(() => useCreateOperation({patientId}));

        await act(async () => {
            await result.current.createOperation(formData);
        });

        expect(mockSetCachedOperationsForPatient).toHaveBeenCalledWith(patientId, [createdOperation]);
    });

    it('should handle adaptOperationPayload throwing an error', async () => {
        const formData = Builder<OperationForm>().build();
        const errorMessage = 'Validation failed';

        mockedAdaptOperationPayload.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        const {result} = renderHook(() => useCreateOperation({patientId}));

        let operation;
        await act(async () => {
            operation = await result.current.createOperation(formData);
        });

        const expected = {
            createOperation: expect.any(Function),
            error: errorMessage,
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(operation).toBeNull();
        expect(mockedRestClient.post).not.toHaveBeenCalled();
        expect(mockSetCachedOperationsForPatient).not.toHaveBeenCalled();
    });
});
