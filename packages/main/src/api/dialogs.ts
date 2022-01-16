import {OpenDialogProperty} from '@packages/common/src/electron-api/electron-types';
import {BrowserWindow, dialog, MessageBoxOptions, MessageBoxReturnValue} from 'electron';

export async function selectFiles(
    inputProperties: OpenDialogProperty[] = [
        OpenDialogProperty.multiSelections,
        OpenDialogProperty.openFile,
        OpenDialogProperty.openDirectory,
    ],
): Promise<undefined | string[]> {
    const dialogResult = await dialog.showOpenDialog({
        properties: inputProperties,
    });
    if (dialogResult.canceled) {
        return undefined;
    } else {
        return dialogResult.filePaths;
    }
}

export async function showMessageBox(
    message: string,
    options: Omit<MessageBoxOptions, 'message'> = {},
): Promise<MessageBoxReturnValue> {
    const window = BrowserWindow.getFocusedWindow();
    if (!window) {
        throw new Error(`No browser window to attach confirm dialog to.`);
    }
    const dialogResult = await dialog.showMessageBox(window, {
        ...options,
        message,
    });

    return dialogResult;
}
