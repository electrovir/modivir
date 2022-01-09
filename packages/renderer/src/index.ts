import {emptySong, Song} from '@packages/common/src/data/song';
import {ApiRequestType} from '@packages/common/src/electron-api/api-request-type';
import {getElectronWindowInterface} from '@packages/common/src/electron-api/electron-window-interface';

const api = getElectronWindowInterface();

function playRandomSong(songs: Song[]) {
    if (!songs.length) {
        return;
    }
    const randomSongIndex = Math.floor(Math.random() * songs.length);
    const song = songs[randomSongIndex];
    if (!song) {
        console.error(songs);
        throw new Error(
            `Failed to get song: tried to access index ${randomSongIndex} of an array of length ${songs.length} and failed.`,
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
    const response = await api.apiRequest({type: ApiRequestType.ReadLibrary});

    console.log(`received data from backend:`);
    console.log(response.data);
    if (response.data && response.data.length) {
        playRandomSong(response.data);
    } else {
        const files = await api.apiRequest({type: ApiRequestType.SelectFiles});
        if (files.data) {
            console.log(files.data);
            const newSongs: Song[] = files.data.map((filePath) => ({
                ...emptySong,
                filePath,
            }));
            const saveSongs = await api.apiRequest({
                type: ApiRequestType.EditSongs,
                data: newSongs,
            });

            console.log(saveSongs);
            playRandomSong(newSongs);
        } else {
            console.log('got no files');
        }
    }

    const initLibraryResult = await api.apiRequest({type: ApiRequestType.GetConfigDir});
    console.log('library init', initLibraryResult);
    const showPathButton = document.createElement('button');

    const configPath = await api.apiRequest({type: ApiRequestType.GetConfigDir});

    if (!configPath.success) {
        throw new Error(`Failed to get config dir.`);
    }

    showPathButton.addEventListener('click', () => {
        api.apiRequest({type: ApiRequestType.ViewFilePath, data: configPath.data});
    });
    showPathButton.innerText = 'Show Config Dir';
    document.body.appendChild(showPathButton);
}

testApi();
export {};
