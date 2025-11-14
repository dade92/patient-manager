import { validateOperationForm } from '../../utils/OperationFormValidator';
import { OperationForm } from '../../components/forms/CreateOperationForm';
import { Builder } from "builder-pattern";
import { ToothDetailForm } from "../../components/forms/ToothSelectionForm";

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

    it('should throw error when tooth number is 0', () => {
        const formDataWithInvalidTooth = Builder<OperationForm>()
            .type('CLEANING')
            .patientId('patient-123')
            .description('Regular dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([
                Builder<ToothDetailForm>()
                    .toothNumber(0)
                    .amount('50.00')
                    .toothType('PERMANENT')
                    .build()
            ])
            .build();

        const formDataWithMixedValidInvalid = Builder<OperationForm>()
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
                    .toothNumber(0)
                    .amount('75.50')
                    .toothType('PERMANENT')
                    .build()
            ])
            .build();

        expect(() => validateOperationForm(formDataWithInvalidTooth)).toThrow(Error);
        expect(() => validateOperationForm(formDataWithMixedValidInvalid)).toThrow(Error);
    });

    it('should throw error when amount is 0 or negative', () => {
        const formDataWithZeroAmount = Builder<OperationForm>()
            .type('CLEANING')
            .patientId('patient-123')
            .description('Regular dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([
                Builder<ToothDetailForm>()
                    .toothNumber(11)
                    .amount('0')
                    .toothType('PERMANENT')
                    .build()
            ])
            .build();

        const formDataWithNegativeAmount = Builder<OperationForm>()
            .type('CLEANING')
            .patientId('patient-123')
            .description('Regular dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([
                Builder<ToothDetailForm>()
                    .toothNumber(12)
                    .amount('-50.00')
                    .toothType('PERMANENT')
                    .build()
            ])
            .build();

        expect(() => validateOperationForm(formDataWithZeroAmount)).toThrow(Error);
        expect(() => validateOperationForm(formDataWithNegativeAmount)).toThrow(Error);
    });

    it('should accept valid tooth numbers and positive amounts', () => {
        const formDataWithValidDetails = Builder<OperationForm>()
            .type('CLEANING')
            .patientId('patient-123')
            .description('Regular dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([
                Builder<ToothDetailForm>()
                    .toothNumber(18)
                    .amount('100.50')
                    .toothType('PERMANENT')
                    .build(),
                Builder<ToothDetailForm>()
                    .toothNumber(21)
                    .amount('0.01')
                    .toothType('DECIDUOUS')
                    .build()
            ])
            .build();

        expect(() => validateOperationForm(formDataWithValidDetails)).not.toThrow();
    });

    it('should pass validation with empty tooth details array', () => {
        const formDataWithEmptyDetails = Builder<OperationForm>()
            .type('CLEANING')
            .patientId('patient-123')
            .description('Regular dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([])
            .build();

        expect(() => validateOperationForm(formDataWithEmptyDetails)).not.toThrow();
    });

    it('should throw error when multiple tooth details have invalid values', () => {
        const formDataWithMultipleInvalid = Builder<OperationForm>()
            .type('CLEANING')
            .patientId('patient-123')
            .description('Regular dental cleaning')
            .executor('Dr. Smith')
            .toothDetails([
                Builder<ToothDetailForm>()
                    .toothNumber(0)
                    .amount('50.00')
                    .toothType('PERMANENT')
                    .build(),
                Builder<ToothDetailForm>()
                    .toothNumber(12)
                    .amount('0')
                    .toothType('PERMANENT')
                    .build(),
                Builder<ToothDetailForm>()
                    .toothNumber(0)
                    .amount('-25.00')
                    .toothType('DECIDUOUS')
                    .build()
            ])
            .build();

        expect(() => validateOperationForm(formDataWithMultipleInvalid)).toThrow(Error);
    });
});
