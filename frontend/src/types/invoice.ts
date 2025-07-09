export interface Invoice {
    id: string;
    operationId: string;
    amount: Money;
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Money {
    amount: number;
    currency: string;
}

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}