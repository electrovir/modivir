import {matchesShallowObjectSignature} from './object-validator';

export type UserPreferences = {
    libraryDirectoryPath: string;
};

const emptyUserPreferences: UserPreferences = {libraryDirectoryPath: ''} as const;

export function isValidUserPreferences(input: any): input is UserPreferences {
    if (!matchesShallowObjectSignature(input, emptyUserPreferences)) {
        return false;
    }

    return true;
}
