import {act, renderHook} from '@testing-library/react';
import {useAddNote} from '../../hooks/useAddNote';
import {RestClient} from '../../utils/restClient';
import {Builder} from 'builder-pattern';
import {Operation} from '../../types/operation';

jest.mock('../../utils/restClient');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;

describe('useAddNote', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully add a note', async () => {
        mockedRestClient.post.mockResolvedValue(CREATED_OPERATION);
        const {result} = renderHook(() => useAddNote(OPERATION_ID));

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
        expect(returnedOperation).toEqual(CREATED_OPERATION);
        expect(mockedRestClient.post).toHaveBeenCalledWith(`/api/operation/${OPERATION_ID}/notes`, {content: NOTE});
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });

    it('should set error when backend call fails', async () => {
        mockedRestClient.post.mockRejectedValue(new Error('Network error'));
        const {result} = renderHook(() => useAddNote(OPERATION_ID));

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

    const OPERATION_ID = 'OP-ID';
    const CREATED_OPERATION = Builder<Operation>().id(OPERATION_ID).build()
    const NOTE = 'a note';
});

