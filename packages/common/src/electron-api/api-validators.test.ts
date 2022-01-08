import {isValidBoolean} from './api-validators';

describe(isValidBoolean.name, () => {
    it('should work on valid booleans', () => {
        const validBooleans: boolean[] = [true, false];

        validBooleans.forEach((validBoolean) => {
            expect(isValidBoolean(validBoolean)).toBe(true);
        });
    });

    it('should fail on invalid booleans', () => {
        const invalidBooleans: any[] = [{}, [], 5, 'hello there'];

        invalidBooleans.forEach((validBoolean) => {
            expect(isValidBoolean(validBoolean)).toBe(false);
        });
    });
});
