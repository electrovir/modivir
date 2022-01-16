import {join} from 'path';
import {HasGetPath} from '../../augments/electron';
import {checkDir} from '../../augments/file-system';
import {readUserPreferences} from '../user-preferences';

export const songsFile = 'songs.json';

export async function getSongsPath(appPaths: HasGetPath) {
    return join(await getLibraryDir(appPaths), songsFile);
}

export async function getLibraryDir(appPaths: HasGetPath): Promise<string> {
    const libraryPath = (await readUserPreferences(appPaths)).libraryDirectoryPath;
    checkDir(libraryPath);

    return libraryPath;
}
