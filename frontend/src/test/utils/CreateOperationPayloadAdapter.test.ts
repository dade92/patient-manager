import {adaptOperationPayload} from '../../utils/CreateOperationPayloadAdapter';
import {OperationForm} from '../../components/forms/CreateOperationForm';
import {ToothType} from '../../types/ToothDetail';
import {Builder} from "builder-pattern";
import {ToothDetailForm} from "../../components/forms/ToothSelectionForm";
import {toMoney} from "../../utils/AmountToMoneyConverter";
import {validateOperationForm} from "../../utils/OperationFormValidator";

jest.mock(
    '../../utils/AmountToMoneyConverter',
    () => ({toMoney: jest.fn()})
);
jest.mock(
    '../../utils/OperationFormValidator',
    () => ({validateOperationForm: jest.fn()})
);
const toMoneyMock = toMoney as jest.Mock;
const validateOperationFormMock = validateOperationForm as jest.Mock;

describe('CreateOperationPayloadAdapter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly adapt operation form data', () => {
        toMoneyMock
            .mockReturnValueOnce({amount: 125.5, currency: 'EUR'})
            .mockReturnValueOnce({amount: 50.0, currency: 'EUR'})
            .mockReturnValueOnce({amount: 75.5, currency: 'EUR'});

        const formData = Builder<OperationForm>()
            .type(TYPE)
            .patientId(PATIENT_ID)
            .description(DESCRIPTION)
            .executor(EXECUTOR)
            .toothDetails([
                Builder<ToothDetailForm>()
                    .toothNumber(A_TOOTH_NUMBER)
                    .amount('50.00')
                    .toothType('PERMANENT')
                    .build(),
                Builder<ToothDetailForm>()
                    .toothNumber(ANOTHER_TOOTH_NUMBER)
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
            type: TYPE,
            patientId: PATIENT_ID,
            description: DESCRIPTION,
            estimatedCost: {
                amount: 125.5,
                currency: 'EUR'
            },
            executor: EXECUTOR,
            patientOperationInfo: {
                details: [
                    {
                        toothNumber: A_TOOTH_NUMBER,
                        estimatedCost: {
                            amount: 50.00,
                            currency: 'EUR'
                        },
                        toothType: ToothType.PERMANENT
                    },
                    {
                        toothNumber: ANOTHER_TOOTH_NUMBER,
                        estimatedCost: {
                            amount: 75.50,
                            currency: 'EUR'
                        },
                        toothType: ToothType.DECIDUOUS
                    }
                ]
            }
        });

        expect(validateOperationFormMock).toHaveBeenCalledWith(formData);
        expect(toMoneyMock).toHaveBeenCalledWith('125.5');
        expect(toMoneyMock).toHaveBeenCalledWith('50.00');
        expect(toMoneyMock).toHaveBeenCalledWith('75.50');
        expect(toMoneyMock).toHaveBeenCalledTimes(3);
    });

    it('should throw an error if validation fails', () => {
        const formData = Builder<OperationForm>().build();

        const error = new Error('Validation failed');
        validateOperationFormMock.mockImplementation(() => {
            throw error
        });

        expect(
            () => adaptOperationPayload(formData)
        ).toThrow(error);
    });

    const TYPE = 'CLEANING';
    const PATIENT_ID = 'patient-123';
    const DESCRIPTION = 'Regular dental cleaning';
    const EXECUTOR = 'Dr. Smith';
    const A_TOOTH_NUMBER = 11;
    const ANOTHER_TOOTH_NUMBER = 12;
});
