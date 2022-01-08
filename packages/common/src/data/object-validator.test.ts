import {matchesShallowObjectSignature} from './object-validator';

describe(matchesShallowObjectSignature.name, () => {
    it('should pass on same property value types', () => {
        const testObject = {
            a: 'hello',
            b: 'there',
            c: 4,
            what: ['it does not matter what is in here because', 'it only does shallow checking'],
        };
        const comparisonObject = {
            a: 'what',
            b: 'ever',
            c: 2,
            what: [],
        };
        expect(matchesShallowObjectSignature(testObject, comparisonObject)).toBe(true);
    });

    it('should pass on when the test object property values are sub classes of the comparison', () => {
        class FakeDate extends Date {}

        const testObject = {
            a: 'hello',
            b: new Date(),
            c: new FakeDate(),
        };
        const comparisonObject = {a: 'what', b: new Date(), c: new Date()};
        expect(matchesShallowObjectSignature(testObject, comparisonObject)).toBe(true);
    });

    it('should fail when types are not equal', () => {
        class FakeDate extends Date {}

        const testObject = {
            a: 'hello',
            b: 3,
            c: new FakeDate(),
        };
        const comparisonObject = {a: 'what', b: 'ever', c: new Date()};
        expect(matchesShallowObjectSignature(testObject, comparisonObject)).toBe(false);
    });

    it('should fail when test object property class is not a sub-class of the comparison property', () => {
        const testObject = {
            a: 'hello',
            b: 'there',
            c: new RegExp('f'),
        };
        const comparisonObject = {a: 'what', b: 'ever', c: new Date()};
        expect(matchesShallowObjectSignature(testObject, comparisonObject)).toBe(false);
    });
});
