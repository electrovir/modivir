import {isValidUserPreferences, UserPreferences} from '@packages/common/src/data/user-preferences';
import {AppName} from '@packages/common/src/environment';
import {existsSync} from 'fs';
import {ensureDir} from 'fs-extra';
import {readFile, writeFile} from 'fs/promises';
import {homedir} from 'os';
import {dirname, join} from 'path';

export const libraryConfig = join(homedir(), '.config', AppName, 'preferences.json');

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
        return undefined;
    }
}

export async function savePreferences(
    input: UserPreferences,
    preferencesPath = libraryConfig,
): Promise<boolean> {
    await ensureDir(dirname(preferencesPath));

    const stringified = JSON.stringify(input, null, 4);

    await writeFile(preferencesPath, stringified);

    // check that valid JSON was written
    // todo: deep equality check to make sure written data was identical to data that was intended to be written
    const writtenPreferences = await readPreferences(preferencesPath);

    if (!writtenPreferences) {
        throw new Error(`Wrote preferences but file is empty`);
    }

    return true;
}
