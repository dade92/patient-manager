import {Money} from "./Money";

export interface Invoice {
    id: string;
    operationId: string;
    amount: Money;
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
}

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}