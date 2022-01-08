import {isValidUserPreferences, UserPreferences} from '@packages/common/src/data/user-preferences';
import {AppName} from '@packages/common/src/environment';
import {existsSync} from 'fs';
import {readFile} from 'fs/promises';
import {homedir} from 'os';
import {join} from 'path';

export const libraryConfig = join(homedir(), '.config', AppName);

export async function readPreferences(
    preferencesPath = libraryConfig,
): Promise<undefined | UserPreferences> {
    if (existsSync(preferencesPath)) {
        try {
            const libraryContents = (await readFile(preferencesPath)).toString();
            const parsedLibrary = JSON.parse(libraryContents);

            if (!isValidUserPreferences(parsedLibrary)) {
                throw new Error(`User preferences file contents failed validation.`);
            }

            return parsedLibrary;
        } catch (error) {
            console.error(`Failed to read user preferences file:`);
            console.error(error);
            return undefined;
        }
    } else {
        return {songs: []};
    }
}

export async function savePreferences(input: UserPreferences): Promise<boolean> {
    return false;
}
