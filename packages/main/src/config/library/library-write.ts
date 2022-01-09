import {LibraryWriteResult} from '@packages/common/src/data/library-write-result';
import {Song} from '@packages/common/src/data/song';
import {writePackedJson} from '../../augments/file-system';
import {CanGetPath} from '../config-path';
import {getSongsPath} from './library-files';
import {readSongs} from './library-read';

export async function writeSongs(
    songs: Song[],
    appPaths: CanGetPath,
): Promise<LibraryWriteResult[]> {
    const currentLibraryContents = await readSongs(appPaths);

    function writeSong(song: Song): boolean {
        // -1 song index indicates we're adding a new song
        if (song.index === -1) {
            const newSong = {...song, index: currentLibraryContents.length};
            currentLibraryContents.push(newSong);
            if (currentLibraryContents[newSong.index] !== newSong) {
                throw new Error(
                    `Inserted new song with index ${newSong.index} but it was not inserted into the song array at that index!`,
                );
            }
            return true;
        }
        // otherwise we are editing currently existing songs
        else {
            const existingSong = currentLibraryContents[song.index];

            if (existingSong) {
                currentLibraryContents[song.index] = {
                    ...existingSong,
                    ...song,
                };
                return true;
            }
            // song does not exist
            else {
                throw new Error(
                    `Failed to edit song with index ${song.index}, a song with that index does not yet exist!`,
                );
            }
        }
    }

    const writeResults: LibraryWriteResult[] = songs.map((song): LibraryWriteResult => {
        try {
            writeSong(song);
            return {success: true};
        } catch (rawError) {
            const errorMessage: string =
                rawError instanceof Error ? rawError.message : String(rawError);
            return {success: false, error: errorMessage};
        }
    });

    await writePackedJson(await getSongsPath(appPaths), currentLibraryContents);

    return writeResults;
}
