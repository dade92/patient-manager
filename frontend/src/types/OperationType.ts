import {Money} from "./Money";

export interface OperationType {
    type: string;
    description: string;
    estimatedBaseCost: Money;
}