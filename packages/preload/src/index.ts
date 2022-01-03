import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('versions', process.versions);

contextBridge.exposeInMainWorld('api', {
    send: (channel: string, data: any) => {
        // whitelist channels
        let validChannels = ['doThing'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (channel: string, callback: CallableFunction) => {
        let validChannels = ['doThing'];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => callback(...args));
        }
    },
});
