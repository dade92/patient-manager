import {act, renderHook} from '@testing-library/react';
import {useAddNote} from '../../hooks/useAddNote';
import {RestClient} from '../../utils/restClient';
import {Builder} from 'builder-pattern';
import {Operation} from '../../types/operation';

jest.mock('../../utils/restClient');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;

describe('useAddNote', () => {
    const createdOperation = Builder<Operation>().build()

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully add a note', async () => {
        mockedRestClient.post.mockResolvedValue(createdOperation);
        const {result} = renderHook(() => useAddNote({operationId: OPERATION_ID}));

        let returnedOperation: Operation | null = null;
        await act(async () => {
            returnedOperation = await result.current.addNote(NOTE);
        });

        const expected = {
            addNote: expect.any(Function),
            error: null,
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(returnedOperation).toEqual(createdOperation);
        expect(mockedRestClient.post).toHaveBeenCalledWith(`/api/operation/${OPERATION_ID}/notes`, {content: NOTE});
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });

    it('should set error when backend call fails', async () => {
        mockedRestClient.post.mockRejectedValue(new Error('Network error'));
        const {result} = renderHook(() => useAddNote({operationId: OPERATION_ID}));

        let returnedOperation: Operation | null = null;
        await act(async () => {
            returnedOperation = await result.current.addNote(NOTE);
        });

        const expected = {
            addNote: expect.any(Function),
            error: 'An error occurred while adding the note',
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(returnedOperation).toBeNull();
        expect(mockedRestClient.post).toHaveBeenCalledWith(`/api/operation/${OPERATION_ID}/notes`, {content: NOTE});
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });

    const OPERATION_ID = 'OP-1';
    const NOTE = 'New note';
});

