import {validateOperationForm} from '../../utils/OperationFormValidator';
import {OperationForm} from '../../components/forms/CreateOperationForm';
import {Builder} from "builder-pattern";
import {ToothDetailForm} from "../../components/forms/ToothSelectionForm";

describe('OperationFormValidator', () => {
    it('should pass validation with valid form data', () => {
        const validFormData = Builder<OperationForm>()
            .type('CLEANING')
            .patientId('patient-123')
            .description('Regular dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([
                Builder<ToothDetailForm>()
                    .toothNumber(11)
                    .amount('50.00')
                    .toothType('PERMANENT')
                    .build(),
                Builder<ToothDetailForm>()
                    .toothNumber(12)
                    .amount('75.50')
                    .toothType('PERMANENT')
                    .build()
            ])
            .build();

        expect(() => validateOperationForm(validFormData)).not.toThrow();
    });

    it('should pass validation with empty tooth details array', () => {
        const formDataWithEmptyDetails = Builder<OperationForm>()
            .toothDetails([])
            .build();

        expect(() => validateOperationForm(formDataWithEmptyDetails)).not.toThrow();
    });

    it('should throw error when tooth number is 0', () => {
        const formDataWithInvalidTooth = Builder<OperationForm>()
            .toothDetails([Builder<ToothDetailForm>().toothNumber(0).build()])
            .build();

        expect(() => validateOperationForm(formDataWithInvalidTooth)).toThrow(Error);
    });

    it('should throw error when multiple tooth details have invalid values', () => {
        const formDataWithMultipleInvalid = Builder<OperationForm>()
            .toothDetails([
                Builder<ToothDetailForm>().toothNumber(0).build(),
                Builder<ToothDetailForm>().amount('-25.00').build()
            ])
            .build();

        expect(() => validateOperationForm(formDataWithMultipleInvalid)).toThrow(Error);
    });
});
