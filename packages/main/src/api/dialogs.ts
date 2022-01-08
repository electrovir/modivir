import {dialog} from 'electron';

export async function selectFiles(): Promise<undefined | string[]> {
    const dialogResult = await dialog.showOpenDialog({
        properties: ['multiSelections', 'openFile', 'openDirectory'],
    });
    if (dialogResult.canceled) {
        return undefined;
    } else {
        return dialogResult.filePaths;
    }
}
