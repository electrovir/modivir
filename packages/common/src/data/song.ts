import {getObjectTypedKeys} from 'augment-vir';
import {isValidArray, typeofValidators} from '../electron-api/api-validation';
import {matchesShallowObjectSignature} from './object-validator';

export type SongRating = 0 | 1 | 2 | 3 | 4 | 5 | undefined;

export type SongFileStats = {
    lengthMs: number;
    fileSizeBytes: number;
    format: string;
    lossless: boolean;
    sampleRate: number;
    channelCount: number;
    codec: string;
};

export type Song = SongFileStats & {
    index: number;
    filePath: string;

    artists: Readonly<string[]>;
    albums: Readonly<string[]>;
    genres: Readonly<string[]>;

    rating?: SongRating;
    lyrics?: string | undefined;
};

export const emptySongFileStats: SongFileStats = {
    lengthMs: -1,
    fileSizeBytes: -1,
    format: 'unknown',
    channelCount: -1,
    lossless: false,
    sampleRate: -1,
    codec: 'unknown',
};

export const emptySong: Song = {
    filePath: '',
    index: -1,
    artists: [''],
    albums: [''],
    genres: [''],
    ...emptySongFileStats,
} as const;

export function isValidSongFileStats(input: any): input is SongFileStats {
    if (!matchesShallowObjectSignature(input, emptySongFileStats, false)) {
        return false;
    }

    return true;
}

export function isValidSong(input: any): input is Song {
    if (!matchesShallowObjectSignature(input, emptySong)) {
        return false;
    }

    return getObjectTypedKeys(emptySong).every((songPropertyKey) => {
        const testingArray = input[songPropertyKey];

        if (Array.isArray(testingArray)) {
            const comparisonArray = emptySong[songPropertyKey];

            if (Array.isArray(comparisonArray)) {
                const compareType = typeof comparisonArray[0];
                const elementValidator = typeofValidators[compareType];

                return isValidArray<any>(testingArray, elementValidator);
            } else {
                return false;
            }
        }

        return true;
    });
}
