import { Money } from './Money';

export interface PatientOperationInfo {
    details: any[];
}

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
    estimatedCost: Money;
    patientOperationInfo: PatientOperationInfo;
}

export interface OperationNote {
    content: string;
    createdAt: string;
}

export enum OperationType {
    CONSULTATION = 'CONSULTATION',
    DIAGNOSTIC = 'DIAGNOSTIC',
    SURGERY = 'SURGERY',
    TREATMENT = 'TREATMENT',
    FOLLOW_UP = 'FOLLOW_UP'
}
