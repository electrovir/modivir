import {emptySong, Song} from '@packages/common/src/data/song';
import {ApiRequestType} from '@packages/common/src/electron-api/api-request-type';
import {ApiFullResponse} from '@packages/common/src/electron-api/api-response';
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

async function populateLibrary(): Promise<ApiFullResponse<ApiRequestType.ReadLibrary>> {
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

        console.log({saveSongs});
    }
    return await api.apiRequest({type: ApiRequestType.ReadLibrary});
}

async function readLibrary(alreadyTried = false): Promise<Song[]> {
    const response =
        (await api.apiRequest({type: ApiRequestType.ReadLibrary})) ?? (await populateLibrary());

    if (response.data && response.data.length) {
        return response.data;
    } else if (!alreadyTried) {
        await populateLibrary();
        return readLibrary(true);
    } else {
        throw new Error(`Failed to populate library.`);
    }
}

async function testApi() {
    try {
        const songs = await readLibrary();
        console.log({songs});
        playRandomSong(songs);

        const configDir = await api.apiRequest({type: ApiRequestType.GetConfigDir});
        console.log('config dir', configDir);
    } catch (error) {
        console.error(error);
    }
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
