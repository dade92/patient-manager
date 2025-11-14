import {adaptOperationPayload} from '../utils/CreateOperationPayloadAdapter';
import {OperationForm} from '../components/forms/CreateOperationForm';
import {ToothType} from '../types/ToothDetail';
import {Builder} from "builder-pattern";
import {ToothDetailForm} from "../components/forms/ToothSelectionForm";

const {toMoney} = require('../utils/AmountToMoneyConverter');
const {validateOperationForm} = require('../utils/OperationFormValidator');

jest.mock('../utils/AmountToMoneyConverter', () => ({
    toMoney: jest.fn().mockImplementation((amount: string) => ({
        amount: parseFloat(amount),
        currency: 'EUR'
    }))
}));

jest.mock('../utils/OperationFormValidator', () => ({
    validateOperationForm: jest.fn(),
}));

describe('CreateOperationPayloadAdapter', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        (toMoney as jest.Mock)
            .mockReturnValueOnce({ amount: 125.5, currency: 'EUR' })  // First call - total estimated cost
            .mockReturnValueOnce({ amount: 50.0, currency: 'EUR' })   // Second call - first tooth detail
            .mockReturnValueOnce({ amount: 75.5, currency: 'EUR' });  // Third call - second tooth detail
    });

    it('should correctly adapt operation form data', () => {
        const formData = Builder<OperationForm>()
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
                    .toothType('DECIDUOUS')
                    .build(),
                Builder<ToothDetailForm>()
                    .toothNumber(0)
                    .amount('')
                    .toothType('PERMANENT')
                    .build(),
            ])
            .build();

        const result = adaptOperationPayload(formData);

        expect(result).toEqual({
            type: 'CLEANING',
            patientId: 'patient-123',
            description: 'Regular dental cleaning',
            estimatedCost: {
                amount: 125.5,
                currency: 'EUR'
            },
            executor: 'Dr. Smith',
            patientOperationInfo: {
                details: [
                    {
                        toothNumber: 11,
                        estimatedCost: {
                            amount: 50.00,
                            currency: 'EUR'
                        },
                        toothType: ToothType.PERMANENT
                    },
                    {
                        toothNumber: 12,
                        estimatedCost: {
                            amount: 75.50,
                            currency: 'EUR'
                        },
                        toothType: ToothType.DECIDUOUS
                    }
                ]
            }
        });

        expect(validateOperationForm).toHaveBeenCalledWith(formData);
        expect(toMoney).toHaveBeenCalledWith('125.5');
        expect(toMoney).toHaveBeenCalledWith('50.00');
        expect(toMoney).toHaveBeenCalledWith('75.50');
        expect(toMoney).toHaveBeenCalledTimes(3);
    });
});
