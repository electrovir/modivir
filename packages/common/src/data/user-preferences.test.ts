import {isValidUserPreferences, UserPreferences} from './user-preferences';

describe(isValidUserPreferences.name, () => {
    it('should work on valid user preferences objects', () => {
        const validUserPreferences: UserPreferences[] = [
            {
                libraryDirectoryPath: 'some words go here',
            },
            {
                libraryDirectoryPath: '',
            },
        ];

        validUserPreferences.forEach((validUserPreference) => {
            expect(isValidUserPreferences(validUserPreference)).toBe(true);
        });
    });

    it('should fail on invalid user preferences objects', () => {
        const invalidUserPreferences: any[] = [
            {
                songs: [
                    {
                        derp: 'anything goes here',
                    },
                    {
                        what: '',
                    },
                ],
            },
            {
                songs: 5,
            },
            {
                chickens: [
                    {
                        filePath: 'derp',
                    },
                ],
            },
        ];

        invalidUserPreferences.forEach((invalidUserPreference) => {
            expect(isValidUserPreferences(invalidUserPreference)).toBe(false);
        });
    });
});
