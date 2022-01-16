import {ResetType} from '@packages/common/src/electron-api/reset';
import {displayAppName} from '@packages/common/src/environment';
import {remove} from 'fs-extra';
import {showMessageBox} from '../api/dialogs';
import {ModivirApp} from '../augments/electron';
import {backupConfig} from './config-backup';
import {getConfigDir} from './config-path';

export async function resetConfig(resetType: ResetType, modivirApp: ModivirApp): Promise<boolean> {
    const backupLocation = await backupConfig(modivirApp);

    switch (resetType) {
        case ResetType.All: {
            const result = await showMessageBox(
                'WARNING: Are you sure you want to reset all preferences and library data?',
                `This will reset all your ${displayAppName} preferences as well as all your music library data including song list, saved metadata, and playlists. Song files themselves will not be altered.

A backup of your data is stored in ${backupLocation}.`,
                {
                    type: 'error',
                    cancelId: 0,
                    defaultId: 1,
                    noLink: true,
                    buttons: ['Cancel', 'Delete Everything'],
                },
            );
            if (result.response) {
                try {
                    await remove(getConfigDir(modivirApp));

                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                } finally {
                    // restart to init and load new configs
                    modivirApp.relaunch();
                    modivirApp.quit();
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
