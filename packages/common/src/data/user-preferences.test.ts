import {emptyUserPreferences, isValidUserPreferences, UserPreferences} from './user-preferences';

describe(isValidUserPreferences.name, () => {
    it('should work on valid user preferences objects', () => {
        const validUserPreferences: UserPreferences[] = [
            {
                ...emptyUserPreferences,
                libraryDirectoryPath: 'some words go here',
            },
            {
                ...emptyUserPreferences,
                libraryDirectoryPath: '',
            },
            {
                ...emptyUserPreferences,
                startupWindowPosition: {
                    height: 100,
                    width: 100,
                    x: 100,
                    y: 100,
                    useLast: false,
                },
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
