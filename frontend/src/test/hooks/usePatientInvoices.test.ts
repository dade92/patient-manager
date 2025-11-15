import {act, renderHook} from '@testing-library/react';
import {usePatientInvoices} from '../../hooks/usePatientInvoices';
import {RestClient} from '../../utils/restClient';
import {useCache} from '../../context/CacheContext';
import {Invoice, InvoiceStatus} from '../../types/invoice';
import {Builder} from 'builder-pattern';

jest.mock('../../utils/restClient');
jest.mock('../../context/CacheContext');

const mockedRestClient = RestClient as jest.Mocked<typeof RestClient>;
const mockedUseCache = useCache as jest.Mock;

describe('usePatientInvoices', () => {
    const mockGetCachedInvoicesForPatient = jest.fn();
    const mockSetCachedInvoicesForPatient = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCache.mockReturnValue({
            getCachedInvoicesForPatient: mockGetCachedInvoicesForPatient,
            setCachedInvoicesForPatient: mockSetCachedInvoicesForPatient,
        });
    });

    it('should successfully fetch invoices and cache the result', async () => {
        const patientId = 'PAT-001';
        const invoices: Invoice[] = [
            createInvoice('INV-001', 'OP-001'),
            createInvoice('INV-002', 'OP-002')
        ];
        mockGetCachedInvoicesForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValue({invoices});

        const {result} = renderHook(() => usePatientInvoices(patientId));

        expect(result.current.loading).toBe(true);
        expect(result.current.invoices).toEqual([]);
        expect(result.current.error).toBeNull();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            invoices: invoices,
            loading: false,
            error: null,
            updatingPaidInvoice: '',
            updatingCancelledInvoice: '',
            changeInvoiceStatus: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedInvoicesForPatient).toHaveBeenCalledWith(patientId);
        expect(mockGetCachedInvoicesForPatient).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/invoice/patient/${patientId}`);
        expect(mockSetCachedInvoicesForPatient).toHaveBeenCalledWith(patientId, invoices);
    });

    it('should return cached invoices when available', async () => {
        const patientId = 'PAT-002';
        const cachedInvoices: Invoice[] = [createInvoice('INV-003', 'OP-003', InvoiceStatus.PAID)];
        mockGetCachedInvoicesForPatient.mockReturnValue(cachedInvoices);

        const {result} = renderHook(() => usePatientInvoices(patientId));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            invoices: cachedInvoices,
            loading: false,
            error: null,
            updatingPaidInvoice: '',
            updatingCancelledInvoice: '',
            changeInvoiceStatus: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedInvoicesForPatient).toHaveBeenCalledWith(patientId);
        expect(mockGetCachedInvoicesForPatient).toHaveBeenCalledTimes(1);
        expect(mockedRestClient.get).not.toHaveBeenCalled();
        expect(mockSetCachedInvoicesForPatient).not.toHaveBeenCalled();
    });

    it('should handle error when fetching invoices fails', async () => {
        const patientId = 'PAT-003';
        const error = new Error('Network error');
        mockGetCachedInvoicesForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockRejectedValue(error);

        const {result} = renderHook(() => usePatientInvoices(patientId));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const expected = {
            invoices: [],
            loading: false,
            error: 'An error occurred while fetching invoices',
            updatingPaidInvoice: '',
            updatingCancelledInvoice: '',
            changeInvoiceStatus: expect.any(Function)
        };

        expect(result.current).toEqual(expected);
        expect(mockGetCachedInvoicesForPatient).toHaveBeenCalledWith(patientId);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/invoice/patient/${patientId}`);
        expect(mockSetCachedInvoicesForPatient).not.toHaveBeenCalled();
    });

    it('should successfully change invoice status', async () => {
        const expectedStatus = InvoiceStatus.PAID;
        const patientId = 'PAT-001';
        const originalInvoices: Invoice[] = [
            createInvoice('INV-001', 'OP-001', InvoiceStatus.PENDING),
            createInvoice('INV-002', 'OP-002', InvoiceStatus.PENDING)
        ];

        const updatedInvoice = createInvoice('INV-001', 'OP-001', expectedStatus);
        mockGetCachedInvoicesForPatient.mockReturnValue(undefined);
        mockedRestClient.get.mockResolvedValue({invoices: originalInvoices});
        mockedRestClient.post.mockResolvedValue(updatedInvoice);

        const {result} = renderHook(() => usePatientInvoices(patientId));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.invoices).toEqual(originalInvoices);
        expect(mockedRestClient.get).toHaveBeenCalledWith(`/api/invoice/patient/${patientId}`);
        expect(mockSetCachedInvoicesForPatient).toHaveBeenCalledWith(patientId, originalInvoices);

        await act(async () => {
            await result.current.changeInvoiceStatus('INV-001', expectedStatus);
        });

        const finalInvoices = [
            updatedInvoice,
            originalInvoices[1]
        ];
        expect(result.current.invoices).toEqual(finalInvoices);
        expect(result.current.updatingPaidInvoice).toBe('');
        expect(result.current.updatingCancelledInvoice).toBe('');
        expect(result.current.error).toBeNull();
        expect(mockSetCachedInvoicesForPatient).toHaveBeenCalledWith(patientId, finalInvoices);
        expect(mockedRestClient.post).toHaveBeenCalledWith('/api/invoice/INV-001/status', {status: expectedStatus});
    });

    const createInvoice = (id: string, operationId: string, status: InvoiceStatus = InvoiceStatus.PENDING): Invoice =>
        Builder<Invoice>()
            .id(id)
            .status(status)
            .operationId(operationId)
            .build();
});
