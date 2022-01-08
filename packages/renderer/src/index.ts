import {ApiRequestType} from '@packages/common/src/electron-api/api-request';
import {getElectronWindowInterface} from '@packages/common/src/electron-api/electron-window-interface';

const player = new Audio(`file:///Users/electrovir/Desktop/audio2.m4a`);
player.play();
player.loop = true;

const api = getElectronWindowInterface();

console.log(api.versions);

async function testApi() {
    const response = await api.apiRequest({type: ApiRequestType.GetPreferences});

    console.log(`received data from backend:`);
    console.log(response);
}

testApi();
export {};
