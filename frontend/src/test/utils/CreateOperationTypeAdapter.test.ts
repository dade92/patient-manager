import {adaptCreateOperationTypePayload} from '../../utils/CreateOperationTypeAdapter';
import {CreateOperationTypeFormData} from '../../components/forms/CreateOperationTypeForm';
import {Builder} from "builder-pattern";
import {validateCreateOperationTypeForm} from "../../utils/CreateOperationTypeValidator";

jest.mock('../../utils/CreateOperationTypeValidator', () => ({
    validateCreateOperationTypeForm: jest.fn(),
}));
const validateCreateOperationTypeFormMock = validateCreateOperationTypeForm as jest.Mock;

describe('CreateOperationTypeAdapter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly adapt operation type form data', () => {
        const formData = Builder<CreateOperationTypeFormData>()
            .type('  teeth cleaning  ')
            .description('  Professional dental cleaning procedure  ')
            .amount('150.75')
            .currency('EUR')
            .build();

        const result = adaptCreateOperationTypePayload(formData);

        expect(result).toEqual({
            type: 'TEETH CLEANING',
            description: 'Professional dental cleaning procedure',
            estimatedBaseCost: {
                amount: 150.75,
                currency: 'EUR'
            }
        });

        expect(validateCreateOperationTypeFormMock).toHaveBeenCalledWith(formData);
        expect(validateCreateOperationTypeFormMock).toHaveBeenCalledTimes(1);
    });
});
