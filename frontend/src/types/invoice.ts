export interface Invoice {
    id: string;
    operationId: string;
    amount: {
        amount: number;
        currency: string;
    };
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
}

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}