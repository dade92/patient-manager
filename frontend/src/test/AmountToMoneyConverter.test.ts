import {toMoney} from '../utils/AmountToMoneyConverter';

describe('AmountToMoneyConverter', () => {
    test('should convert valid string amount to Money', () => {
        const result = toMoney('123.45');

        expect(result).toEqual({
            amount: 123.45,
            currency: 'EUR'
        });
    });

    test('should handle integer string amounts', () => {
        const result = toMoney('100');

        expect(result).toEqual({
            amount: 100,
            currency: 'EUR'
        });
    });

    test('should handle decimal string amounts with multiple decimal places', () => {
        const result = toMoney('99.999');

        expect(result).toEqual({
            amount: 99.999,
            currency: 'EUR'
        });
    });

    test('should handle zero amount', () => {
        const result = toMoney('0');

        expect(result).toEqual({
            amount: 0,
            currency: 'EUR'
        });
    });

    test('should handle negative amounts', () => {
        const result = toMoney('-50.25');

        expect(result).toEqual({
            amount: -50.25,
            currency: 'EUR'
        });
    });

    test('should handle string with spaces', () => {
        const result = toMoney(' 123.45 ');

        expect(result).toEqual({
            amount: 123.45,
            currency: 'EUR'
        });
    });

    test('should handle edge case of string "0.0"', () => {
        const result = toMoney('0.0');

        expect(result).toEqual({
            amount: 0,
            currency: 'EUR'
        });
    });
});
