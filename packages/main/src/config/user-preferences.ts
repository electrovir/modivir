import {extractMessage} from '@packages/common/src/augments/error';
import {isValidUserPreferences, UserPreferences} from '@packages/common/src/data/user-preferences';
import {existsSync} from 'fs';
import {ensureDir} from 'fs-extra';
import {dirname, join} from 'path';
import {readPackedJson, writePackedJson} from '../augments/file-system';
import {CanGetPath, getConfigDir, getPreferencesFilePath} from './config-path';

async function getDefaultUserPreferences(appPaths: CanGetPath): Promise<UserPreferences> {
    const libraryDirectoryPath = join(getConfigDir(appPaths), 'library');

    return {
        libraryDirectoryPath,
    };
}

let readAttemptDepth = 0;

export async function readPreferences(appPaths: CanGetPath): Promise<UserPreferences> {
    readAttemptDepth++;
    const preferencesPath = getPreferencesFilePath(appPaths);

    if (existsSync(preferencesPath)) {
        try {
            const parsedLibrary = await readPackedJson(preferencesPath);

            if (!isValidUserPreferences(parsedLibrary)) {
                throw new Error(`User preferences file contents failed validation.`);
            }

            readAttemptDepth = 0;
            return parsedLibrary;
        } catch (error) {
            throw new Error(`Failed to read user preferences file: ${extractMessage(error)}`);
        }
    } else {
        if (readAttemptDepth > 2) {
            throw new Error(`Failed to save off default user preferences multiple times.`);
        }
        await savePreferences(await getDefaultUserPreferences(appPaths), appPaths);
        return await getDefaultUserPreferences(appPaths);
    }
}

export async function savePreferences(
    input: UserPreferences,
    appPaths: CanGetPath,
): Promise<boolean> {
    const preferencesPath = getPreferencesFilePath(appPaths);
    await ensureDir(dirname(preferencesPath));

    await writePackedJson(preferencesPath, input);

    // check that valid preferences was written
    // todo: deep equality check to make sure written data was identical to data that was intended to be written
    const writtenPreferences = await readPreferences(appPaths);

    if (!writtenPreferences) {
        throw new Error(`Wrote preferences but file is empty`);
    }

    return true;
}
