import {copy} from 'fs-extra';
import {join} from 'path';
import {HasGetPath} from '../augments/electron';
import {getConfigBackupDir, getConfigDir} from './config-path';

export async function backupConfig(appPaths: HasGetPath) {
    const backupsDir = getConfigBackupDir(appPaths);
    const configDir = getConfigDir(appPaths);

    const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
    const backupName = `backup-${timestamp}`;
    const newBackupDirPath = join(backupsDir, backupName);

    await copy(configDir, newBackupDirPath);
    console.info(`Backup saved to ${newBackupDirPath}`);
}
