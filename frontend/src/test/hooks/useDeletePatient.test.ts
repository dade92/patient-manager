import {act, renderHook} from '@testing-library/react';
import {useDeletePatient} from '../../hooks/useDeletePatient';
import {RestClient} from '../../utils/restClient';

jest.mock('../../utils/restClient');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;

describe('useDeletePatient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deletes patient successfully and calls onSuccess', async () => {
        mockedRestClient.post.mockResolvedValue(undefined);
        const onSuccess = jest.fn();

        const {result} = renderHook(() => useDeletePatient({onSuccess}));

        await act(async () => {
            await result.current.deletePatient(PATIENT_ID);
        });

        const expected = {
            deletePatient: expect.any(Function),
            isDeleting: false,
            error: null
        };

        expect(result.current).toEqual(expected);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.post).toHaveBeenCalledWith(`/api/patient/delete/${PATIENT_ID}`, {});
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });

    it('sets error when deletion fails and does not call onSuccess', async () => {
        mockedRestClient.post.mockRejectedValue(new Error('Network error'));
        const onSuccess = jest.fn();

        const {result} = renderHook(() => useDeletePatient({onSuccess}));

        await act(async () => {
            await result.current.deletePatient(PATIENT_ID);
        });

        const expected = {
            deletePatient: expect.any(Function),
            isDeleting: false,
            error: 'Network error'
        };

        expect(result.current).toEqual(expected);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(mockedRestClient.post).toHaveBeenCalledWith(`/api/patient/delete/${PATIENT_ID}`, {});
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });

    it('falls back to default error message when error has empty message', async () => {
        const customError: any = {message: ''};
        mockedRestClient.post.mockRejectedValue(customError);
        const onSuccess = jest.fn();

        const {result} = renderHook(() => useDeletePatient({onSuccess}));

        await act(async () => {
            await result.current.deletePatient(PATIENT_ID);
        });

        const expected = {
            deletePatient: expect.any(Function),
            isDeleting: false,
            error: 'Failed to delete patient'
        };

        expect(result.current).toEqual(expected);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(mockedRestClient.post).toHaveBeenCalledWith(`/api/patient/delete/${PATIENT_ID}`, {});
        expect(mockedRestClient.post).toHaveBeenCalledTimes(1);
    });

    const PATIENT_ID = 'PAT-ID';
});

