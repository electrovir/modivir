import {getObjectTypedKeys} from 'augment-vir';
import {isValidArray, typeofValidators} from '../electron-api/api-validation';
import {matchesShallowObjectSignature} from './object-validator';

export type SongRating = 0 | 1 | 2 | 3 | 4 | 5 | undefined;

export type Song = {
    filePath: string;
    index: number;
    lengthMs: number;
    fileSizeBytes: number;
    format: string;
    artists: Readonly<string[]>;
    albums: Readonly<string[]>;
    genres: Readonly<string[]>;

    rating?: SongRating;
    lyrics?: string | undefined;
};

export const emptySong: Song = {
    filePath: '',
    fileSizeBytes: 0,
    format: '',
    index: -1,
    lengthMs: 0,
    artists: [''],
    albums: [''],
    genres: [''],
} as const;

export function isValidSong(input: any): input is Song {
    if (!matchesShallowObjectSignature(input, emptySong, true)) {
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
