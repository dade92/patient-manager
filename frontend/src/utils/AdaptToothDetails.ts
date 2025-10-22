import {ToothDetailForm} from "../components/forms/ToothSelectionForm";
import {ToothDetail, ToothType} from "../types/ToothDetail";
import {toMoney} from "./AmountToMoneyConverter";

export const adaptToothDetails = (toothDetailsForm: ToothDetailForm[]): ToothDetail[] =>
    toothDetailsForm
        .filter(detail => detail.toothNumber !== null && detail.amount.trim() !== '')
        .map((detail: ToothDetailForm) => ({
            toothNumber: detail.toothNumber,
            estimatedCost: toMoney(detail.amount),
            toothType: detail.toothType as ToothType
        }))