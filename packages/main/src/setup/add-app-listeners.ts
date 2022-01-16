import {ModivirApp} from '../augments/electron';
import {handleClosing} from './on-close';

export async function addAppListeners(modivirApp: ModivirApp) {
    saveWindowPositionBeforeQuit(modivirApp);
}

function saveWindowPositionBeforeQuit(modivirApp: ModivirApp): void {
    modivirApp.on('before-quit', async (event) => {
        await handleClosing(modivirApp, event);
        modivirApp.quit();
    });
}
