import {formatAmount} from '../utils/currencyUtils';

describe('currencyUtils', () => {
    it('should format EUR currency correctly with Italian locale', () => {
        const result = formatAmount(123.45, 'EUR');

        expect(result).toBe('123,45\u00A0€');
    });

    it('should format USD currency correctly with Italian locale', () => {
        const result = formatAmount(99.99, 'USD');

        expect(result).toBe('99,99\u00A0USD');
    });

    it('should format zero amount correctly', () => {
        const result = formatAmount(0, 'EUR');

        expect(result).toBe('0,00\u00A0€');
    });

    it('should format negative amounts correctly', () => {
        const result = formatAmount(-50.75, 'EUR');

        expect(result).toBe('-50,75\u00A0€');
    });
});
