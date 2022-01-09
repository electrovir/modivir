import {isValidSong, Song} from '@packages/common/src/data/song';
import {assertIsValidArray} from '@packages/common/src/electron-api/api-validation';
import {existsSync} from 'fs';
import {readPackedJson} from '../../augments/file-system';
import {CanGetPath} from '../config-path';
import {getSongsPath} from './library-files';
import {initLibrary} from './library-init';

export async function readSongs(appPaths: CanGetPath): Promise<Song[]> {
    const songsFilePath = await getSongsPath(appPaths);

    if (!existsSync(songsFilePath)) {
        await initLibrary(appPaths);
    }

    try {
        const parsedContents = await readPackedJson(songsFilePath);

        assertIsValidArray(parsedContents, isValidSong);

        return parsedContents;
    } catch (error) {
        throw new Error(`Failed to JSON parse songs file from ${songsFilePath}`);
    }
}
