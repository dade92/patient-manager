import {idFormatter} from '../../utils/idFormatter';

describe('idFormatter', () => {
    it('should format UIDs correctly', () => {
        const longUid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
        expect(idFormatter(longUid)).toBe('a1b2c3d4...');
    });
});
