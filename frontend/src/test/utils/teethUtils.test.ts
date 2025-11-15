import {generateFdiDeciduousTeethNumbers, generateFdiTeethNumbers} from '../../utils/teethUtils';

describe('teethUtils', () => {
    it('should generate correct PERMANENT teeth numbers', () => {
        const result = generateFdiTeethNumbers();
        const upperJaw = result[0];
        const lowerJaw = result[1];

        expect(lowerJaw).toHaveLength(16);
        expect(upperJaw).toHaveLength(16);

        expect(lowerJaw.slice(0, 8)).toEqual([48, 47, 46, 45, 44, 43, 42, 41]);
        expect(lowerJaw.slice(8, 16)).toEqual([31, 32, 33, 34, 35, 36, 37, 38]);
        expect(upperJaw.slice(0, 8)).toEqual([18, 17, 16, 15, 14, 13, 12, 11]);
        expect(upperJaw.slice(8, 16)).toEqual([21, 22, 23, 24, 25, 26, 27, 28]);

        expect(result[0].length + result[1].length).toBe(32);
    });

    it('should generate correct DECIDUOUS teeth numbers', () => {
        const result = generateFdiDeciduousTeethNumbers();
        const upperJaw = result[0];
        const lowerJaw = result[1];

        expect(upperJaw).toHaveLength(10);
        expect(lowerJaw).toHaveLength(10);

        expect(upperJaw.slice(0, 5)).toEqual([55, 54, 53, 52, 51]);
        expect(upperJaw.slice(5, 10)).toEqual([61, 62, 63, 64, 65]);
        expect(lowerJaw.slice(0, 5)).toEqual([85, 84, 83, 82, 81]);
        expect(lowerJaw.slice(5, 10)).toEqual([71, 72, 73, 74, 75]);

        expect(result[0].length + result[1].length).toBe(20);
    });
});
