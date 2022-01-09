import {join} from 'path';
import {checkDir} from '../../augments/file-system';
import {CanGetPath} from '../config-path';
import {readPreferences} from '../user-preferences';

export const songsFile = 'songs.json';

export async function getSongsPath(appPaths: CanGetPath) {
    return join(await getLibraryDir(appPaths), songsFile);
}

export async function getLibraryDir(appPaths: CanGetPath): Promise<string> {
    const libraryPath = (await readPreferences(appPaths)).libraryDirectoryPath;
    checkDir(libraryPath);

    return libraryPath;
}
