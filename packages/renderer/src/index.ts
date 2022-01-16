import {emptySong, Song} from '@packages/common/src/data/song';
import {ApiRequestType} from '@packages/common/src/electron-api/api-request-type';
import {ApiFullResponse} from '@packages/common/src/electron-api/api-response';
import {getElectronWindowInterface} from '@packages/common/src/electron-api/electron-window-interface';
import {GetPathType} from '@packages/common/src/electron-api/get-path-type';
import {ResetType} from '@packages/common/src/electron-api/reset';

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

console.info(api.versions);

async function populateLibrary(): Promise<ApiFullResponse<ApiRequestType.ReadLibrary>> {
    const files = await api.apiRequest({type: ApiRequestType.SelectFiles});
    if (files.data) {
        console.info(files.data);
        const newSongs: Song[] = files.data.map((filePath) => ({
            ...emptySong,
            filePath,
        }));
        const saveSongs = await api.apiRequest({
            type: ApiRequestType.EditSongs,
            data: newSongs,
        });

        console.info({saveSongs: saveSongs.data});
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
        console.info({songs});
        playRandomSong(songs);

        const configDir = await api.apiRequest({
            type: ApiRequestType.GetPath,
            data: GetPathType.ConfigDir,
        });
        console.info('config dir', configDir);
    } catch (error) {
        console.error(error);
    }
    const showPathButton = document.createElement('button');

    const configPath = await api.apiRequest({
        type: ApiRequestType.GetPath,
        data: GetPathType.ConfigDir,
    });

    if (!configPath.success) {
        throw new Error(`Failed to get config dir.`);
    }

    showPathButton.addEventListener('click', async () => {
        await api.apiRequest({type: ApiRequestType.ViewFilePath, data: configPath.data});
    });
    showPathButton.innerText = 'Show Config Dir';
    document.body.appendChild(showPathButton);

    const resetConfigButton = document.createElement('button');
    resetConfigButton.addEventListener('click', async () => {
        await api.apiRequest({type: ApiRequestType.ResetConfig, data: ResetType.All});
    });

    resetConfigButton.innerText = 'Reset All Configs';
    document.body.appendChild(resetConfigButton);
}

testApi();
export {};
