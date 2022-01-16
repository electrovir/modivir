import {isValidSongFileStats, SongFileStats} from '@packages/common/src/data/song';
import {repoDir} from '@packages/common/src/file-paths';
import {dirname, join} from 'path';
import {failedToDetermineAudioFormatMessage, getSongFileStats} from './song-file-info';

const testSongFiles = {
    epicSong: join(repoDir, 'test-files', 'songs', 'boxcat-games', 'BoxCat Games - Epic Song.mp3'),
    notSong: join(repoDir, 'test-files', 'songs', 'not-a-song-file.txt'),
};

describe(getSongFileStats.name, () => {
    const epicSongOutputPromise: Promise<Readonly<SongFileStats>> = getSongFileStats(
        testSongFiles.epicSong,
    );

    it('should be able to read song files', async () => {
        expect(await epicSongOutputPromise).toBeTruthy();
    });

    it('should output valid stat types', async () => {
        expect(isValidSongFileStats(await epicSongOutputPromise)).toBe(true);
    });

    it('should product the correct stats', async () => {
        expect(await epicSongOutputPromise).toEqual({
            channelCount: 2,
            fileSizeBytes: 1517392,
            codec: 'MPEG 1 Layer 3',
            format: 'MPEG',
            lengthMs: 54936,
            lossless: false,
            sampleRate: 44100,
        });
    });

    it('should fail on non music files', async () => {
        await expect(
            async () => await getSongFileStats(dirname(testSongFiles.epicSong)),
        ).rejects.toThrow(Error);

        await expect(async () => await getSongFileStats(testSongFiles.notSong)).rejects.toThrow(
            failedToDetermineAudioFormatMessage,
        );
    });
});
