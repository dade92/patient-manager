import {act, renderHook} from '@testing-library/react';
import {useCreateInvoice} from '../../hooks/useCreateInvoice';
import {RestClient} from '../../utils/restClient';
import {useCache} from '../../context/CacheContext';
import {Builder} from 'builder-pattern';
import {Invoice} from '../../types/invoice';
import {Money} from '../../types/Money';

jest.mock('../../utils/restClient');
jest.mock('../../context/CacheContext');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;
const mockedUseCache = useCache as jest.Mock;

describe('useCreateInvoice', () => {
    const mockAddCachedInvoiceForPatient = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCache.mockReturnValue({
            addCachedInvoiceForPatient: mockAddCachedInvoiceForPatient
        });
    });

    it('should successfully create an invoice and update cache', async () => {
        const payload = {
            operationId: OPERATION_ID,
            patientId: PATIENT_ID,
            amount: {amount: 150, currency: 'EUR'} as Money
        };

        mockedRestClient.post.mockResolvedValue(AN_INVOICE);

        const {result} = renderHook(() => useCreateInvoice(PATIENT_ID));

        let invoice;
        await act(async () => {
            invoice = await result.current.createInvoice(payload);
        });

        const expected = {
            createInvoice: expect.any(Function),
            error: null,
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(invoice).toEqual(AN_INVOICE);
        expect(mockedRestClient.post).toHaveBeenCalledWith('/api/invoice', payload);
        expect(mockAddCachedInvoiceForPatient).toHaveBeenCalledWith(PATIENT_ID, AN_INVOICE);
    });

    it('should handle error when creating invoice fails', async () => {
        const payload = {
            operationId: OPERATION_ID,
            patientId: PATIENT_ID,
            amount: {amount: 200, currency: 'EUR'} as Money
        };
        mockedRestClient.post.mockRejectedValue(new Error());

        const {result} = renderHook(() => useCreateInvoice(PATIENT_ID));

        let invoice;
        await act(async () => {
            invoice = await result.current.createInvoice(payload);
        });

        const expected = {
            createInvoice: expect.any(Function),
            error: 'An error occurred while creating the invoice',
            isSubmitting: false
        };

        expect(result.current).toEqual(expected);
        expect(invoice).toBeNull();
        expect(mockedRestClient.post).toHaveBeenCalledWith('/api/invoice', payload);
        expect(mockAddCachedInvoiceForPatient).not.toHaveBeenCalled();
    });

    const INVOICE_ID = 'INV-001';
    const PATIENT_ID = 'PAT-001';
    const OPERATION_ID = 'OP-001';
    const AN_INVOICE =
        Builder<Invoice>()
            .id(INVOICE_ID)
            .operationId(OPERATION_ID)
            .build();
});
