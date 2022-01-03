import {dialog, ipcMain} from 'electron';
import {readFile} from 'fs/promises';

export function setupIpcCommunication() {
    ipcMain.on('doThing', async (event, arg) => {
        const {canceled, filePaths, bookmarks} = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{name: 'Images', extensions: ['png', 'jpg', 'jpeg']}],
        });
        if (canceled) {
            return event.reply('doThing', undefined);
        }

        const base64 = (await readFile(filePaths[0]!)).toString('base64');
        event.reply('doThing', base64);
    });
}
