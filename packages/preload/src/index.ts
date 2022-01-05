import {expose} from './expose';

expose({
    versions: process.versions,
});

// contextBridge.exposeInMainWorld('fdkas', {
//     send: (channel: string, data: any) => {
//         // whitelist channels
//         let validChannels = ['doThing'];
//         if (validChannels.includes(channel)) {
//             ipcRenderer.send(channel, data);
//         }
//     },
//     on: (channel: string, callback: CallableFunction) => {
//         let validChannels = ['doThing'];
//         if (validChannels.includes(channel)) {
//             // Deliberately strip event as it includes `sender`
//             ipcRenderer.on(channel, (event, ...args) => callback(...args));
//         }
//     },
// });
