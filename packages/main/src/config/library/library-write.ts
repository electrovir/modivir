import {asyncInOrderMap} from '@packages/common/src/augments/array';
import {extractMessage} from '@packages/common/src/augments/error';
import {LibraryWriteResult} from '@packages/common/src/data/library-write-result';
import {Song, SongFileStats} from '@packages/common/src/data/song';
import {existsSync} from 'fs';
import {readdir, stat} from 'fs/promises';
import {join} from 'path';
import {HasGetPath} from '../../augments/electron';
import {writePackedJson} from '../../augments/file-system';
import {getSongsPath} from './library-files';
import {readSongs} from './library-read';
import {getSongFileStats} from './song-file-info';

export async function writeSongs(
    songs: Readonly<Readonly<Song>[]>,
    appPaths: HasGetPath,
): Promise<LibraryWriteResult[]> {
    const currentLibraryContents = await readSongs(appPaths);

    async function addSong(
        inputSong: Readonly<Song>,
    ): Promise<LibraryWriteResult | LibraryWriteResult[]> {
        if (!existsSync(inputSong.filePath)) {
            throw new Error(`Given song file "${inputSong.filePath}" does not exist!`);
        } else if ((await stat(inputSong.filePath)).isDirectory()) {
            const subSongs = await readdir(inputSong.filePath);
            const songsAdded: LibraryWriteResult[] = (
                await asyncInOrderMap(
                    subSongs,
                    async (subSongName): Promise<LibraryWriteResult | LibraryWriteResult[]> => {
                        const subSong: Readonly<Song> = {
                            ...inputSong,
                            filePath: join(inputSong.filePath, subSongName),
                        };
                        return await addSong(subSong);
                    },
                )
            ).flat();
            return songsAdded;
        }

        const returnBase: Pick<LibraryWriteResult, 'filePath'> = {filePath: inputSong.filePath};

        try {
            const songFileStats: Readonly<SongFileStats> = await getSongFileStats(
                inputSong.filePath,
            );

            const song: Readonly<Song> = {...inputSong, ...songFileStats};

            // -1 song index indicates we're adding a new song
            if (song.index === -1) {
                const newSong = {...song, index: currentLibraryContents.length};
                currentLibraryContents.push(newSong);
                if (currentLibraryContents[newSong.index] !== newSong) {
                    return {
                        success: false,
                        error: `Inserted new song with index ${newSong.index} but it was not inserted into the song array at that index!`,
                        ...returnBase,
                    };
                }
                return {success: true, ...returnBase};
            }
            // otherwise we are editing currently existing songs
            else {
                const existingSong = currentLibraryContents[song.index];

                if (existingSong) {
                    currentLibraryContents[song.index] = {
                        ...existingSong,
                        ...song,
                    };
                    return {success: true, ...returnBase};
                }
                // song does not exist
                else {
                    return {
                        success: false,
                        error: `Failed to edit song with index ${song.index}, a song with that index does not yet exist!`,
                        ...returnBase,
                    };
                }
            }
        } catch (error) {
            return {success: false, error: extractMessage(error), ...returnBase};
        }
    }

    const writeResults: LibraryWriteResult[] = await songs.reduce(
        async (
            accumPromise: Promise<LibraryWriteResult[]>,
            song,
        ): Promise<LibraryWriteResult[]> => {
            const accum = await accumPromise;
            try {
                const addedSongs = await addSong(song);
                if (Array.isArray(addedSongs)) {
                    accum.push(...addedSongs);
                } else {
                    accum.push(addedSongs);
                }
            } catch (error) {
                accum.push({success: false, error: extractMessage(error), filePath: song.filePath});
            }

            return accum;
        },
        Promise.resolve([]),
    );

    await writePackedJson(await getSongsPath(appPaths), currentLibraryContents);

    return writeResults;
}
