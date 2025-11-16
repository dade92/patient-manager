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

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCache.mockReturnValue({
            getCachedOperationsForPatient: mockGetCachedOperationsForPatient,
            setCachedOperationsForPatient: mockSetCachedOperationsForPatient
        });
    });

    it('should successfully create an operation and update cache', async () => {
        const formData = Builder<OperationForm>().patientId(PATIENT_ID).build();
        const adaptedPayload = {
            type: 'CLEANING',
            patientId: PATIENT_ID,
            description: 'Dental cleaning',
            executor: 'Dr. Smith',
            estimatedCost: {amount: 100, currency: 'EUR'},
            toothDetails: []
        };
        const createdOperation: Operation = Builder<Operation>()
            .id(OPERATION_ID)
            .patientId(PATIENT_ID)
            .build();
        const existingOperations: Operation[] = [
            Builder<Operation>()
                .id(ANOTHER_OPERATION_ID)
                .patientId(PATIENT_ID)
                .build()
        ];
        mockedAdaptOperationPayload.mockReturnValue(adaptedPayload);
        mockedRestClient.post.mockResolvedValue(createdOperation);
        mockGetCachedOperationsForPatient.mockReturnValue(existingOperations);

        const {result} = renderHook(() => useCreateOperation(PATIENT_ID));

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
        expect(mockGetCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID);
        expect(mockSetCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID, [createdOperation, ...existingOperations]);
    });

    it('should handle error when creating operation fails', async () => {
        const formData = Builder<OperationForm>()
            .patientId(PATIENT_ID)
            .build();
        const errorMessage = 'Network error';

        mockedAdaptOperationPayload.mockReturnValue({});
        mockedRestClient.post.mockRejectedValue(new Error(errorMessage));

        const {result} = renderHook(() => useCreateOperation(PATIENT_ID));

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
        expect(mockGetCachedOperationsForPatient).not.toHaveBeenCalled();
    });

    it('should handle case when no cached operations exist', async () => {
        const formData = Builder<OperationForm>()
            .patientId(PATIENT_ID)
            .build();
        const createdOperation: Operation = Builder<Operation>()
            .id(OPERATION_ID)
            .patientId(PATIENT_ID)
            .build();

        mockedAdaptOperationPayload.mockReturnValue({});
        mockedRestClient.post.mockResolvedValue(createdOperation);
        mockGetCachedOperationsForPatient.mockReturnValue(null);

        const {result} = renderHook(() => useCreateOperation(PATIENT_ID));

        await act(async () => {
            await result.current.createOperation(formData);
        });

        expect(mockSetCachedOperationsForPatient).toHaveBeenCalledWith(PATIENT_ID, [createdOperation]);
    });

    const PATIENT_ID = 'PAT-001';
    const OPERATION_ID = 'OP-001';
    const ANOTHER_OPERATION_ID = 'OP-002';
});
