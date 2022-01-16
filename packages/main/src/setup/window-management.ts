import {extractMessage} from '@packages/common/src/augments/error';
import {WindowPosition} from '@packages/common/src/data/user-preferences';
import {devServerUrl} from '@packages/common/src/environment';
import {prodPreloadScriptIndex} from '@packages/common/src/file-paths';
import {BrowserWindow} from 'electron';
import {URL} from 'url';
import {ModivirApp} from '../augments/electron';
import {readUserPreferences} from '../config/user-preferences';
import {saveWindowPosition, shouldUseWindowPosition} from '../config/window-position';

export async function startupWindow(modivirApp: ModivirApp, devMode: boolean) {
    let browserWindow: BrowserWindow | undefined;

    /** Prevent multiple instances */
    const isFirstInstance = modivirApp.requestSingleInstanceLock();
    if (!isFirstInstance) {
        modivirApp.quit();
        process.exit(0);
    }
    modivirApp.on('second-instance', async () => {
        browserWindow = await createOrRestoreWindow(browserWindow, devMode, modivirApp);
    });

    /** Shut down background process if all windows was closed */
    modivirApp.on('window-all-closed', () => {
        // don't quit on macOS since apps typically stay open even when all their windows are closed
        if (process.platform !== 'darwin') {
            modivirApp.quit();
        }
    });

    /** Create app window after background process is ready */
    await modivirApp.whenReady();

    try {
        browserWindow = await createOrRestoreWindow(browserWindow, devMode, modivirApp);
    } catch (createWindowError) {
        console.error(`Failed to create window: ${createWindowError}`);
    }
}

async function createOrRestoreWindow(
    browserWindow: BrowserWindow | undefined,
    devMode: boolean,
    modivirApp: ModivirApp,
): Promise<BrowserWindow> {
    // If window already exist just show it
    if (browserWindow && !browserWindow.isDestroyed()) {
        if (browserWindow.isMinimized()) browserWindow.restore();
        browserWindow.focus();

        return browserWindow;
    }

    let userPreferences;

    try {
        userPreferences = await readUserPreferences(modivirApp);
    } catch (error) {}

    const windowPosition: WindowPosition | {} =
        userPreferences && shouldUseWindowPosition(userPreferences?.startupWindowPosition)
            ? userPreferences.startupWindowPosition
            : {};

    browserWindow = new BrowserWindow({
        /** Use 'ready-to-show' event to show window */
        show: false,
        ...windowPosition,
        webPreferences: {
            sandbox: true,
            /**
             * Turn off web security in dev because we're using a web server for the frontend
             * content. However, in prod we MUST have this turned on.
             */
            webSecurity: !devMode,
            preload: prodPreloadScriptIndex,
        },
    });

    /**
     * If you install `show: true` then it can cause issues when trying to close the window. Use
     * `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    browserWindow.on('ready-to-show', () => {
        browserWindow?.show();

        if (devMode) {
            browserWindow?.webContents.openDevTools();
        }
    });

    let preventedAlready = false;

    browserWindow.on('close', async (event) => {
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
            browserWindow?.close();
        }
    });

    /** URL for main window. Vite dev server for development. */
    const pageUrl: string =
        devMode && devServerUrl
            ? devServerUrl
            : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

    await browserWindow.loadURL(pageUrl);

    return browserWindow;
}
