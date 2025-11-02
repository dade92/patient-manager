import {ToothDetailForm} from "../components/forms/ToothSelectionForm";
import {toMoney} from "./AmountToMoneyConverter";
import {ToothDetail, ToothType} from "../types/ToothDetail";
import {OperationForm} from "../components/forms/CreateOperationForm";
import {validateOperationForm} from "./OperationFormValidator";

export const adaptOperationPayload = (formData: OperationForm) => {
    validateOperationForm(formData);

    const totalEstimatedCost = formData.toothDetails.reduce((sum, detail) => {
        const amount = parseFloat(detail.amount) || 0;
        return sum + amount;
    }, 0);

    return {
        type: formData.type,
        patientId: formData.patientId,
        description: formData.description,
        estimatedCost: toMoney(totalEstimatedCost.toString()),
        executor: formData.executor,
        patientOperationInfo: {
            details: adaptToothDetails(formData.toothDetails)
        }
    };
};

const adaptToothDetails = (toothDetailsForm: ToothDetailForm[]): ToothDetail[] =>
    toothDetailsForm
        .filter(detail => detail.toothNumber !== null && detail.amount.trim() !== '')
        .map((detail: ToothDetailForm) => ({
            toothNumber: detail.toothNumber,
            estimatedCost: toMoney(detail.amount),
            toothType: detail.toothType as ToothType
        }))