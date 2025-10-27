import {OperationType} from "../types/operation";
import {ToothDetailForm} from "../components/forms/ToothSelectionForm";
import {toMoney} from "./AmountToMoneyConverter";
import {ToothDetail, ToothType} from "../types/ToothDetail";
import {OperationForm} from "../components/forms/CreateOperationForm";

export const adaptOperationPayload = (formData: OperationForm) => ({
    type: formData.type as OperationType,
    patientId: formData.patientId,
    description: formData.description,
    estimatedCost: toMoney(formData.estimatedCost),
    executor: formData.executor,
    patientOperationInfo: {
        details: adaptToothDetails(formData.toothDetails)
    }
});

const adaptToothDetails = (toothDetailsForm: ToothDetailForm[]): ToothDetail[] =>
    toothDetailsForm
        .filter(detail => detail.toothNumber !== null && detail.amount.trim() !== '')
        .map((detail: ToothDetailForm) => ({
            toothNumber: detail.toothNumber,
            estimatedCost: toMoney(detail.amount),
            toothType: detail.toothType as ToothType
        }))