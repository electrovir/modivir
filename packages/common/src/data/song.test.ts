import {isValidSong, Song} from './song';

describe(isValidSong.name, () => {
    it('should work on valid song objects', () => {
        const validSongs: Song[] = [
            {
                filePath: 'anything goes here',
            },
            {
                filePath: '',
            },
        ];

        validSongs.forEach((validSong) => {
            expect(isValidSong(validSong)).toBe(true);
        });
    });

    it('should fail on invalid song objects', () => {
        const invalidSongs: any[] = [{}, 3, 'hello', [], {filePath: 4}];

        invalidSongs.forEach((invalidSong) => {
            expect(isValidSong(invalidSong)).toBe(false);
        });
    });
});
