export interface Operation {
    id: string;
    patientId: string;
    type: OperationType;
    description: string;
    executor: string;
    assets: string[];
    additionalNotes: OperationNote[];
    createdAt: string;
    updatedAt: string;
}

export interface OperationNote {
    content: string;
    createdAt: string;
}

export type OperationType =
    | 'CONSULTATION'
    | 'DIAGNOSTIC'
    | 'SURGERY'
    | 'THERAPY'
    | 'FOLLOW_UP';
