import {formatDate} from '../../utils/dateUtils';

describe('dateUtils', () => {
    it('should format date correctly with Italian locale', () => {
        const result = formatDate('2023-11-14');

        expect(result).toBe('14/11/2023');
    });

    it('should format ISO date string correctly', () => {
        const result = formatDate('2023-05-25T14:30:00.000Z');

        expect(result).toBe('25/05/2023');
    });
});
