import {Money} from "./Money";

export interface ToothDetail {
    toothNumber: number;
    estimatedCost: Money;
    toothType: ToothType;
}

export enum ToothType {
    PERMANENT = 'PERMANENT',
    DECIDUOUS = 'DECIDUOUS'
}
