import {join} from 'path';
import {HasGetPath} from '../../augments/electron';
import {checkDir} from '../../augments/file-system';
import {readPreferences} from '../user-preferences';

export const songsFile = 'songs.json';

export async function getSongsPath(appPaths: HasGetPath) {
    return join(await getLibraryDir(appPaths), songsFile);
}

export async function getLibraryDir(appPaths: HasGetPath): Promise<string> {
    const libraryPath = (await readPreferences(appPaths)).libraryDirectoryPath;
    checkDir(libraryPath);

    return libraryPath;
}
