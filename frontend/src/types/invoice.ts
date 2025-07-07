export interface Invoice {
    id: string;
    operationId: string;
    amount: {
        amount: number;
        currency: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
}