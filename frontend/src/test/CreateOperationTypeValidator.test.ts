import {validateCreateOperationTypeForm} from '../utils/CreateOperationTypeValidator';
import {CreateOperationTypeFormData} from '../components/forms/CreateOperationTypeForm';
import {Builder} from "builder-pattern";

describe('CreateOperationTypeValidator', () => {
    it('should pass validation with valid form data', () => {
        const validFormData = Builder<CreateOperationTypeFormData>()
            .type('CLEANING')
            .description('Professional dental cleaning')
            .amount('150.75')
            .currency('EUR')
            .build();

        expect(() => validateCreateOperationTypeForm(validFormData)).not.toThrow();
    });

    it('should throw error when type is empty or whitespace only', () => {
        const formDataEmptyType = Builder<CreateOperationTypeFormData>()
            .type('')
            .description('Valid description')
            .amount('150.00')
            .currency('EUR')
            .build();

        const formDataWhitespaceType = Builder<CreateOperationTypeFormData>()
            .type('   ')
            .description('Valid description')
            .amount('150.00')
            .currency('EUR')
            .build();

        expect(() => validateCreateOperationTypeForm(formDataEmptyType)).toThrow(Error);
        expect(() => validateCreateOperationTypeForm(formDataWhitespaceType)).toThrow(Error);
    });

    it('should throw error when description is empty or whitespace only', () => {
        const formDataEmptyDescription = Builder<CreateOperationTypeFormData>()
            .type('CLEANING')
            .description('')
            .amount('150.00')
            .currency('EUR')
            .build();

        const formDataWhitespaceDescription = Builder<CreateOperationTypeFormData>()
            .type('CLEANING')
            .description('   ')
            .amount('150.00')
            .currency('EUR')
            .build();

        expect(() => validateCreateOperationTypeForm(formDataEmptyDescription)).toThrow(Error);
        expect(() => validateCreateOperationTypeForm(formDataWhitespaceDescription)).toThrow(Error);
    });

    it('should accept type and description with leading/trailing whitespace (gets trimmed)', () => {
        const formDataWithWhitespace = Builder<CreateOperationTypeFormData>()
            .type('  CLEANING  ')
            .description('  Professional dental cleaning  ')
            .amount('150.00')
            .currency('EUR')
            .build();

        expect(() => validateCreateOperationTypeForm(formDataWithWhitespace)).not.toThrow();
    });
});
