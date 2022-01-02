import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import {readFile} from 'fs/promises';
import {dirname, join} from 'path';
import {URL} from 'url';
import './security-restrictions';

const repoDir = dirname(dirname(__dirname));

let mainWindow: BrowserWindow | null = null;

function setupIpcCommunication() {
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

async function createOrRestoreWindow(devMode: boolean) {
    // If window already exist just show it
    if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();

        return;
    }

    mainWindow = new BrowserWindow({
        show: false, // Use 'ready-to-show' event to show window
        webPreferences: {
            // sandbox: true,
            // nodeIntegration: true,

            /**
             * Turn off web security in dev because we're using a web server for the frontend
             * content. However, in prod we MUST have this turned on.
             */
            webSecurity: !devMode,
            preload: join(repoDir, 'preload', 'dist', 'index.cjs'),
        },
    });

    /**
     * If you install `show: true` then it can cause issues when trying to close the window. Use
     * `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();

        if (devMode) {
            mainWindow?.webContents.openDevTools();
        }
    });

    /**
     * URL for main window. Vite dev server for development. `file://../renderer/index.html` for
     * production and test
     */
    const pageUrl =
        devMode && process.env['VITE_DEV_SERVER_URL'] !== undefined
            ? process.env['VITE_DEV_SERVER_URL']
            : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

    await mainWindow.loadURL(pageUrl);
}

async function appIsReady(devMode: boolean) {
    try {
        createOrRestoreWindow(devMode);
    } catch (createWindowError) {
        console.error(`Failed to create window: ${createWindowError}`);
    }

    if (!devMode) {
        try {
            const {autoUpdater} = await import('electron-updater');
            autoUpdater.checkForUpdatesAndNotify();
        } catch (updateError) {
            console.error(`Failed to check for updates: ${updateError}`);
        }
    }
}

function setupApp(devMode: boolean) {
    console.log({devMode});

    setupIpcCommunication();

    /** Prevent multiple instances */
    const isFirstInstance = app.requestSingleInstanceLock();
    if (!isFirstInstance) {
        app.quit();
        process.exit(0);
    }
    app.on('second-instance', () => createOrRestoreWindow(devMode));

    /** Disable Hardware Acceleration for more power-save */
    app.disableHardwareAcceleration();

    /** Shut down background process if all windows was closed */
    app.on('window-all-closed', () => {
        // don't quit on macOS since apps typically stay open even when all their windows are closed
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    /** Create app window when background process is ready */
    app.whenReady().then(() => appIsReady(devMode));
}

setupApp(process.env['MODE'] === 'development' ? true : false);
