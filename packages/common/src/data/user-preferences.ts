import {matchesShallowObjectSignature} from './object-validator';
import {isValidSong, Song} from './song';

export type UserPreferences = {
    songs: Song[];
};

const defaultUserPreferences = {songs: []};

export function isValidUserPreferences(input: any): input is UserPreferences {
    if (!matchesShallowObjectSignature(input, defaultUserPreferences)) {
        return false;
    }

    if (!input.songs.every((song) => isValidSong(song))) {
        return false;
    }

    return true;
}
