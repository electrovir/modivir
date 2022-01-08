import {Song} from '@packages/common/src/data/song';
import {UserPreferences} from '@packages/common/src/data/user-preferences';
import {ApiRequestType} from '@packages/common/src/electron-api/api-request';
import {getElectronWindowInterface} from '@packages/common/src/electron-api/electron-window-interface';

const api = getElectronWindowInterface();

function playRandomSong(songs: Song[]) {
    const randomSongIndex = Math.floor(Math.random() * songs.length);
    const song = songs[randomSongIndex];
    if (!song) {
        console.error(songs);
        throw new Error(
            `Tried to access index ${randomSongIndex} of an array of length ${songs.length} and failed.`,
        );
    }
    const player = new Audio(`file:///${song.filePath}`);
    player.loop = false;
    player.play();
    player.addEventListener('ended', () => {
        player.remove();
        playRandomSong(songs);
    });
}

console.log(api.versions);

async function testApi() {
    const response = await api.apiRequest({type: ApiRequestType.GetPreferences});

    console.log(`received data from backend:`);
    console.log(response.data);
    if (response.data) {
        playRandomSong(response.data.songs);
    } else {
        const files = await api.apiRequest({type: ApiRequestType.SelectFiles});
        if (files.data) {
            console.log(files.data);
            const newPreferences: UserPreferences = {
                songs: files.data.map((filePath) => ({filePath})),
            };
            const savePreferences = await api.apiRequest({
                type: ApiRequestType.SavePreferences,
                data: newPreferences,
            });

            console.log(savePreferences);
            playRandomSong(newPreferences.songs);
        } else {
            console.log('got no files');
        }
    }
}

testApi();
export {};
