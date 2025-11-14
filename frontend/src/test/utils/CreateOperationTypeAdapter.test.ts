import {adaptCreateOperationTypePayload} from '../../utils/CreateOperationTypeAdapter';
import {CreateOperationTypeFormData} from '../../components/forms/CreateOperationTypeForm';
import {Builder} from "builder-pattern";

const {validateCreateOperationTypeForm} = require('../../utils/CreateOperationTypeValidator');

jest.mock('../../utils/CreateOperationTypeValidator', () => ({
    validateCreateOperationTypeForm: jest.fn(),
}));

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

        expect(validateCreateOperationTypeForm).toHaveBeenCalledWith(formData);
        expect(validateCreateOperationTypeForm).toHaveBeenCalledTimes(1);
    });
});
