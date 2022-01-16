import {App, BrowserWindow} from 'electron';

/**
 * This is usually just the electron app but since we are ONLY using it in many places just for this
 * one method, might as well not require the entire app.
 */
export type HasGetPath = {
    getPath: App['getPath'];
};

export type ModivirApp = App;

/**
 * This app only have one window at a time but getFocusedWindow isn't reliable because it triggers
 * modals at times which causes the main window to be unfocused.
 */
export function getBrowserWindow(): BrowserWindow | undefined {
    const allWindows = BrowserWindow.getAllWindows();

    if (allWindows.length > 1) {
        console.error('Multiple browser windows detected.');
    }

    return allWindows[0];
}
