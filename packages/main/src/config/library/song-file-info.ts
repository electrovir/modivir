import {hasErrno} from '@packages/common/src/augments/error';
import {SongFileStats} from '@packages/common/src/data/song';
import {existsSync} from 'fs';
import {stat} from 'fs/promises';
import {parseFile} from 'music-metadata';

export const failedToDetermineAudioFormatMessage = 'Failed to determine audio format';

export async function getSongFileStats(filePath: string): Promise<SongFileStats> {
    if (!existsSync(filePath)) {
        throw new Error(`Failed to find song file at path ${filePath}`);
    }

    try {
        const stats = await stat(filePath);

        const fileSizeBytes = stats.size;
        const metadata = await parseFile(filePath);
        console.log(`song metadata for ${filePath}:`, {...metadata});

        return {
            channelCount: metadata.format.numberOfChannels ?? -1,
            fileSizeBytes,
            format: metadata.format.container ?? 'unknown',
            lengthMs: metadata.format.duration ? Math.ceil(metadata.format.duration * 1000) : -1,
            lossless: metadata.format.lossless ?? false,
            sampleRate: metadata.format.sampleRate ?? -1,
            codec: metadata.format.codec ?? 'unknown',
        };
    } catch (error) {
        if (hasErrno(error)) {
            if (error.errno === -21) {
                throw new Error(`Cannot get song stats for a directory: ${filePath}`);
            } else if (error.errno === -4071) {
                /**
                 * So far I've only seen this errno on Windows. The message is:
                 *
                 * "Error: EINVAL: invalid argument, read"
                 */
                throw new Error(`Invalid file type for song stats: ${filePath}`);
            }
        }
        throw error;
    }
}
