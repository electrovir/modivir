import {asyncInOrderMap} from '@packages/common/src/augments/array';
import {LibraryWriteResult} from '@packages/common/src/data/library-write-result';
import {Song, SongFileStats} from '@packages/common/src/data/song';
import {existsSync} from 'fs';
import {writePackedJson} from '../../augments/file-system';
import {CanGetPath} from '../config-path';
import {getSongsPath} from './library-files';
import {readSongs} from './library-read';
import {getSongFileStats} from './song-file-info';

export async function writeSongs(
    songs: Readonly<Readonly<Song>[]>,
    appPaths: CanGetPath,
): Promise<LibraryWriteResult[]> {
    const currentLibraryContents = await readSongs(appPaths);

    async function addSong(inputSong: Readonly<Song>): Promise<boolean> {
        if (!existsSync(inputSong.filePath)) {
            throw new Error(`Given song file "${inputSong.filePath}" does not exist!`);
        }

        const songFileStats: Readonly<SongFileStats> = await getSongFileStats(inputSong.filePath);

        const song: Readonly<Song> = {...inputSong, ...songFileStats};

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

    const writeResults: LibraryWriteResult[] = await asyncInOrderMap(
        songs,
        async (song): Promise<LibraryWriteResult> => {
            try {
                await addSong(song);
                return {success: true};
            } catch (rawError) {
                const errorMessage: string =
                    rawError instanceof Error ? rawError.message : String(rawError);
                return {success: false, error: errorMessage};
            }
        },
    );

    await writePackedJson(await getSongsPath(appPaths), currentLibraryContents);

    return writeResults;
}
