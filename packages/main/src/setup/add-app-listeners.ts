import {extractMessage} from '@packages/common/src/augments/error';
import {ModivirApp} from '../augments/electron';
import {saveWindowPosition} from '../config/window-position';

export async function addAppListeners(modivirApp: ModivirApp) {
    saveWindowPositionBeforeQuit(modivirApp);
}

function saveWindowPositionBeforeQuit(modivirApp: ModivirApp): void {
    let preventedAlready = false;

    modivirApp.on('before-quit', async (event) => {
        if (preventedAlready) {
            return;
        } else {
            preventedAlready = true;
        }

        event.preventDefault();

        try {
            console.info(`Saved window position:`, await saveWindowPosition(modivirApp));
        } catch (error) {
            console.error(`Errored when saving window position: ${extractMessage(error)}`);
            // at this point just ignore errors, we're trying to quit!
        } finally {
            modivirApp.quit();
        }
    });
}
