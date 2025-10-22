import {OperationType} from "../types/operation";
import {ToothDetailForm} from "../components/forms/ToothSelectionForm";
import {toMoney} from "./AmountToMoneyConverter";
import {adaptToothDetails} from "./AdaptToothDetails";

export const adaptOperationPayload = (formData: {
    type: OperationType,
    patientId: string,
    description: string,
    executor: string,
    estimatedCost: string
}, toothDetailsForm: ToothDetailForm[]) => ({
    ...formData,
    estimatedCost: toMoney(formData.estimatedCost),
    patientOperationInfo: {
        details: adaptToothDetails(toothDetailsForm)
    }
});