import {LibraryWriteResult, validateLibraryWriteResult} from './library-write-result';

describe(validateLibraryWriteResult.name, () => {
    it('should return true for valid library write results', () => {
        const validResults: LibraryWriteResult[] = [
            {success: true},
            {success: false, error: 'hello there'},
            {success: false, error: ''},
        ];

        expect(validResults.length).toBeGreaterThan(0);

        validResults.forEach((validResult) => {
            expect(validateLibraryWriteResult(validResult)).toBe(true);
        });
    });

    it('should return false for invalid library write results', () => {
        const invalidResults: any[] = [
            {success: false},
            {success: true, error: 'hello there'},
            {},
            [],
            'derp',
            {success: false, error: new Error('derp')},
        ];

        expect(invalidResults.length).toBeGreaterThan(0);

        invalidResults.forEach((invalidResult) => {
            expect(validateLibraryWriteResult(invalidResult)).toBe(false);
        });
    });
});
