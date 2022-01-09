import {Song} from '@packages/common/src/data/song';
import {readFile} from 'fs/promises';
import {CanGetPath} from '../config-path';
import {getSongsPath} from './library-files';

export async function readSongs(appPaths: CanGetPath): Promise<Song[]> {
    const songsFilePath = await getSongsPath(appPaths);
    let fileContents;
    try {
        fileContents = (await readFile(songsFilePath)).toString();
    } catch (error) {
        throw new Error(`Failed to read songs file from ${songsFilePath}`);
    }

    if (!fileContents.trim()) {
        return [];
    }

    try {
        const parsedContents = JSON.parse(fileContents);
        return parsedContents;
    } catch (error) {
        throw new Error(`Failed to JSON parse songs file from ${songsFilePath}`);
    }
}
