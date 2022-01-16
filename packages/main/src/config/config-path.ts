import {AppName} from '@packages/common/src/environment';
import {join} from 'path';
import {HasGetPath} from '../augments/electron';
import {checkDir} from '../augments/file-system';

export function getConfigDir(appPaths: HasGetPath): string {
    const configDir = join(appPaths.getPath('userData'), `${AppName}-config`);
    checkDir(configDir);

    return configDir;
}

export function getConfigBackupDir(appPaths: HasGetPath): string {
    const defaultConfigDir = getConfigDir(appPaths);
    const backupsDir = defaultConfigDir.replace(/(?:\/|\\)$|$/, '-backups');
    checkDir(backupsDir);

    return backupsDir;
}

export function getPreferencesFilePath(appPaths: HasGetPath): string {
    const configDir = getConfigDir(appPaths);

    return join(configDir, 'user-preferences.json');
}
