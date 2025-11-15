import {act, renderHook} from '@testing-library/react';
import {useCreateOperationType} from '../../hooks/useCreateOperationType';
import {RestClient} from '../../utils/restClient';
import {adaptCreateOperationTypePayload} from '../../utils/CreateOperationTypeAdapter';
import {CreateOperationTypeFormData} from '../../components/forms/CreateOperationTypeForm';
import {Builder} from 'builder-pattern';
import {OperationType} from '../../types/OperationType';

jest.mock('../../utils/restClient');
jest.mock('../../utils/CreateOperationTypeAdapter');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;
const mockedAdaptCreateOperationTypePayload = adaptCreateOperationTypePayload as jest.Mock;

describe('useCreateOperationType', () => {
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully create an operation type', async () => {
        const formData = Builder<CreateOperationTypeFormData>().build();
        const adaptedPayload = {
            type: 'CLEANING',
            description: 'Dental cleaning',
            estimatedBaseCost: {
                amount: 100,
                currency: 'EUR'
            }
        };
        const operationType: OperationType = {
            type: 'CLEANING',
            description: 'Dental cleaning',
            estimatedBaseCost: {amount: 100, currency: 'EUR'}
        };
        const expected = {
            createOperationType: expect.any(Function),
            isSubmitting: false,
            error: null
        };
        mockedAdaptCreateOperationTypePayload.mockReturnValue(adaptedPayload);
        mockedRestClient.post.mockResolvedValue(operationType);

        const {result} = renderHook(() => useCreateOperationType({onSuccess: mockOnSuccess}));

        await act(async () => {
            await result.current.createOperationType(formData);
        });

        expect(result.current).toEqual(expected);
        expect(mockedAdaptCreateOperationTypePayload).toHaveBeenCalledWith(formData);
        expect(mockedRestClient.post).toHaveBeenCalledWith('/api/operation-type', adaptedPayload);
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should handle error when creating operation type fails', async () => {
        const formData = Builder<CreateOperationTypeFormData>().build();
        const adaptedPayload = {
            type: 'CLEANING',
            description: 'Dental cleaning',
            estimatedBaseCost: {
                amount: 100,
                currency: 'EUR'
            }
        };
        const error = new Error('API Error');
        const expected = {
            createOperationType: expect.any(Function),
            isSubmitting: false,
            error: 'An error occurred while creating the operation type'
        };
        mockedAdaptCreateOperationTypePayload.mockReturnValue(adaptedPayload);
        mockedRestClient.post.mockRejectedValue(error);

        const {result} = renderHook(() => useCreateOperationType({onSuccess: mockOnSuccess}));

        await act(async () => {
            await result.current.createOperationType(formData);
        });

        expect(result.current).toEqual(expected);
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });
});
