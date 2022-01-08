import {matchesShallowObjectSignature} from './object-validator';
export type Song = {
    filePath: string;
};

const defaultSong: Song = {filePath: ''} as const;

export function isValidSong(input: any): input is Song {
    return matchesShallowObjectSignature(input, defaultSong);
}
