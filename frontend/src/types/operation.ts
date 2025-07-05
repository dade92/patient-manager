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

export enum OperationType {
    CONSULTATION = 'CONSULTATION',
    DIAGNOSTIC = 'DIAGNOSTIC',
    SURGERY = 'SURGERY',
    THERAPY = 'THERAPY',
    FOLLOW_UP = 'FOLLOW_UP'
}
