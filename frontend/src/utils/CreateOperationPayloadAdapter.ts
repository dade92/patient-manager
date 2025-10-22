import {OperationType} from "../types/operation";
import {ToothDetailForm} from "../components/forms/ToothSelectionForm";
import {toMoney} from "./AmountToMoneyConverter";
import {adaptToothDetails} from "./AdaptToothDetails";
import {OperationForm} from "../components/dialogs/CreateOperationDialog";

export const adaptOperationPayload = (formData: OperationForm) => ({
    type: formData.type as OperationType,
    patientId: formData.patientId,
    description: formData.description,
    estimatedCost: toMoney(formData.estimatedCost),
    patientOperationInfo: {
        details: adaptToothDetails(formData.toothDetails)
    }
});