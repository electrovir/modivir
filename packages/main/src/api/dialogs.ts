import {OpenDialogProperty} from '@packages/common/src/electron-api/electron-types';
import {dialog} from 'electron';

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
