import {ResetType} from '@packages/common/src/electron-api/reset';
import {BrowserWindow} from 'electron';
import {remove} from 'fs-extra';
import {showMessageBox} from '../api/dialogs';
import {ModivirApp} from '../augments/electron';
import {backupConfig} from './config-backup';
import {getConfigBackupDir, getConfigDir} from './config-path';

export async function resetConfig(resetType: ResetType, modivirApp: ModivirApp): Promise<boolean> {
    switch (resetType) {
        case ResetType.All: {
            const result = await showMessageBox(
                `WARNING: this will reset all your user preferences as well as your entire music library.
A backup of this data will be stored in ${getConfigBackupDir(modivirApp)}.

Are you sure you want to reset all preferences and library data?`,
                {
                    type: 'error',
                    cancelId: 0,
                    defaultId: 1,
                    buttons: ['Cancel', 'Delete'],
                },
            );
            if (result.response) {
                try {
                    await backupConfig(modivirApp);
                    await remove(getConfigDir(modivirApp));
                    BrowserWindow.getFocusedWindow()?.reload();
                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            } else {
                return false;
            }
        }
        case ResetType.Library: {
            throw new Error(`Reset not implemented yet for ${resetType}`);
            return false;
        }
        case ResetType.UserPreferences: {
            throw new Error(`Reset not implemented yet for ${resetType}`);
            return false;
        }
    }
}
