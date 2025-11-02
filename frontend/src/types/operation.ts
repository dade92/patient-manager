import { Money } from './Money';
import {ToothDetail} from "./ToothDetail";

export interface Operation {
    id: string;
    patientId: string;
    type: string;
    description: string;
    executor: string;
    assets: string[];
    additionalNotes: OperationNote[];
    createdAt: string;
    updatedAt: string;
    estimatedCost: Money;
    patientOperationInfo: PatientOperationInfo;
}

export interface PatientOperationInfo {
    details: ToothDetail[];
}

export interface OperationNote {
    content: string;
    createdAt: string;
}