import {SongFileStats} from '@packages/common/src/data/song';
import {existsSync} from 'fs';
import {stat} from 'fs/promises';
import {parseFile} from 'music-metadata';

export async function getSongFileStats(filePath: string): Promise<SongFileStats> {
    if (!existsSync(filePath)) {
        throw new Error(`Failed to find song file at path ${filePath}`);
    }

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
}