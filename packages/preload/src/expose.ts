import {ElectronApi, electronApiKey} from '@packages/common/src/electron-api/api';
import {contextBridge} from 'electron';

export function expose(api: ElectronApi) {
    contextBridge.exposeInMainWorld(electronApiKey, api);
}
